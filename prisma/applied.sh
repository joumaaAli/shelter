#!/bin/bash

# Set the path to your prisma/migrations directory
MIGRATIONS_DIR="./migrations"

# Check if the migrations directory exists
if [ ! -d "$MIGRATIONS_DIR" ]; then
  echo "Migrations directory not found at $MIGRATIONS_DIR"
  exit 1
fi

# Loop through all the migration folders
for folder in "$MIGRATIONS_DIR"/*/; do
  # Extract migration name from folder name (e.g., timestamp_migration_name)
  migration_name=$(basename "$folder")

  echo "Marking migration $migration_name as applied..."

  # Use Prisma CLI to mark the migration as applied
  npx prisma migrate resolve --applied "$migration_name"

  if [ $? -eq 0 ]; then
    echo "Successfully marked $migration_name as applied."
  else
    echo "Failed to mark $migration_name as applied."
    exit 1
  fi
done

echo "All migrations have been marked as applied."
