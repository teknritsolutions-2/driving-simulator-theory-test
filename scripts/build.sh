#!/bin/sh
set -eu
project_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
out_dir="$project_dir/dist"
mkdir -p "$out_dir"
find "$out_dir" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
cp "$project_dir/index.html" "$project_dir/404.html" "$project_dir/robots.txt" "$project_dir/sitemap.xml" "$out_dir/"
cp -R "$project_dir/assets" "$project_dir/pages" "$out_dir/"
printf '%s\n' "Built static site in $out_dir"
