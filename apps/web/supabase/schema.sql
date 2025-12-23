-- MarkStyle 数据库表结构（Supabase Auth 版本）
-- 在 Supabase SQL Editor 中执行此脚本
-- 注意：Supabase Auth 自动管理 auth.users 表，无需手动创建

-- ========== MarkStyle 业务表（使用 public schema）==========

-- 用户扩展信息表（关联 auth.users）
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT DEFAULT 'free' CHECK (plan_type IN ('free', 'basic', 'pro')),
  plan_expires_at TIMESTAMPTZ,
  credits INTEGER DEFAULT 20,  -- 新用户赠送 20 积分
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 封面生成记录表 (cover_generations)
CREATE TABLE IF NOT EXISTS public.cover_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_id UUID,
  prompt TEXT NOT NULL,
  image_url TEXT NOT NULL,
  width INTEGER NOT NULL,
  height INTEGER NOT NULL,
  credits_used INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 积分流水表 (credit_transactions)
CREATE TABLE IF NOT EXISTS public.credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('register_bonus', 'purchase', 'invite', 'usage', 'refund', 'subscription')),
  description TEXT,
  reference_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 订单表 (orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_no TEXT UNIQUE NOT NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('subscription', 'credits')),
  product_name TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled', 'refunded')),
  payment_method TEXT,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 访客使用记录表（防止恶意薅免费额度）
CREATE TABLE IF NOT EXISTS public.guest_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint VARCHAR(64),
  ip_address VARCHAR(45),
  used_date DATE DEFAULT CURRENT_DATE,
  used_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fingerprint, used_date),
  UNIQUE(ip_address, used_date)
);

-- 云端文档表 (documents)
CREATE TABLE IF NOT EXISTS public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  local_id VARCHAR(100),  -- 本地 ID，用于迁移对照
  title TEXT NOT NULL DEFAULT '未命名文档',
  content TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ  -- 软删除标记
);

-- ========== 索引 ==========

CREATE INDEX IF NOT EXISTS idx_cover_generations_user ON public.cover_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_generations_created ON public.cover_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_transactions_user ON public.credit_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_guest_usage_fingerprint ON public.guest_usage(fingerprint, used_date);
CREATE INDEX IF NOT EXISTS idx_guest_usage_ip ON public.guest_usage(ip_address, used_date);
CREATE INDEX IF NOT EXISTS idx_documents_user ON public.documents(user_id);
CREATE INDEX IF NOT EXISTS idx_documents_updated ON public.documents(updated_at DESC);

-- ========== 触发器：新用户注册时自动创建 profile 和添加积分 ==========

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 创建用户 profile
  INSERT INTO public.user_profiles (id, credits)
  VALUES (NEW.id, 20);

  -- 添加积分记录
  INSERT INTO public.credit_transactions (user_id, amount, type, description)
  VALUES (NEW.id, 20, 'register_bonus', '新用户注册奖励');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 删除旧触发器（如果存在）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 创建触发器（在 Supabase Auth 的 auth.users 表上）
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ========== 自动更新 updated_at ==========

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- ========== Row Level Security (RLS) ==========

-- 启用 RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cover_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- user_profiles: 用户只能查看和更新自己的 profile
CREATE POLICY "Users can view own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

-- cover_generations: 用户只能查看自己的封面生成记录
CREATE POLICY "Users can view own covers" ON public.cover_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own covers" ON public.cover_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- credit_transactions: 用户只能查看自己的积分记录
CREATE POLICY "Users can view own transactions" ON public.credit_transactions
  FOR SELECT USING (auth.uid() = user_id);

-- orders: 用户只能查看自己的订单
CREATE POLICY "Users can view own orders" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- documents: 用户可以完全管理自己的文档
CREATE POLICY "Users can view own documents" ON public.documents
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents" ON public.documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents" ON public.documents
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents" ON public.documents
  FOR DELETE USING (auth.uid() = user_id);
