#!/bin/bash
set -e

echo "🔄 Running Prisma migrations..."
npx prisma migrate deploy

echo "✅ Migrations completed!"

# Uncomment dòng dưới nếu muốn seed data (chỉ lần đầu)
# echo "🌱 Seeding database..."
# npm run db:seed
# echo "✅ Seeding completed!"
