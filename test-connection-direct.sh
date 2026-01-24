#!/bin/bash
# Test direct connection without Prisma

echo "Testing direct PostgreSQL connection..."
echo ""

# Try with unencoded password first
CONN_1="postgresql://postgres:SupaSynergy23!@db.ycqnfedqajvgeauicckl.supabase.co:5432/postgres?sslmode=require"
echo "Test 1: Unencoded password"
echo "Connection: postgresql://postgres:****@db.ycqnfedqajvgeauicckl.supabase.co:5432/postgres?sslmode=require"

# Try with encoded password
CONN_2="postgresql://postgres:SupaSynergy23%21@db.ycqnfedqajvgeauicckl.supabase.co:5432/postgres?sslmode=require"
echo ""
echo "Test 2: URL-encoded password"
echo "Connection: postgresql://postgres:****@db.ycqnfedqajvgeauicckl.supabase.co:5432/postgres?sslmode=require"

echo ""
echo "If you have psql installed, test with:"
echo "psql \"$CONN_1\""
