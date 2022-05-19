rm -rf node_modules
npm install --target_arch=x64 --target_platform=linux --target_libc=glibc
yarn build
NODE_ENV=production serverless deploy --stage production
rm package-lock.json
yarn install
