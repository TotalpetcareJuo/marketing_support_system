-- 1. profiles 테이블 확장 (지점 주소, 연락처 추가)
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS branch_address text,
ADD COLUMN IF NOT EXISTS phone_number text;

-- 2. contracts 테이블 확장 (담당자 정보 스냅샷 저장용 컬럼 추가)
ALTER TABLE public.contracts 
ADD COLUMN IF NOT EXISTS manager_name text,
ADD COLUMN IF NOT EXISTS manager_phone text,
ADD COLUMN IF NOT EXISTS manager_branch_name text,
ADD COLUMN IF NOT EXISTS manager_branch_address text;

-- 3. 기존 데이터가 있을 경우 참고용 설명:
--profiles 테이블에 데이터를 업데이트하려면:
--UPDATE profiles SET branch_address = '주소', phone_number = '연락처' WHERE id = '유저UUID';
