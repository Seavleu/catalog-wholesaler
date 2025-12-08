-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "full_name" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT,
    "cover_image" TEXT,
    "catalog_images" TEXT[],
    "sizes" TEXT[],
    "colors" TEXT[],
    "stock_status" TEXT NOT NULL DEFAULT 'in_stock',
    "restock_date" TIMESTAMP(3),
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_stage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT,
    "category" TEXT,
    "cover_image" TEXT,
    "catalog_images" TEXT[],
    "notes" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "stock_status" TEXT NOT NULL DEFAULT 'in_stock',
    "restock_date" TIMESTAMP(3),
    "created_date" TIMESTAMP(3),
    "updated_date" TIMESTAMP(3),
    "created_by_id" TEXT,
    "created_by" TEXT,
    "is_sample" BOOLEAN,

    CONSTRAINT "product_stage_pkey" PRIMARY KEY ("id")
);
