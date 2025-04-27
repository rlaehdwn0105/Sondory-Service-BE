FROM node:20-alpine

# 2. 워킹 디렉토리 설정
WORKDIR /app

# 3. package.json과 package-lock.json 복사
COPY package*.json ./

# 4. 의존성 설치
RUN npm install

# 5. 소스 코드 복사
COPY . .

# 6. CMD로 서버 시작
CMD ["node", "src/server.js"]

# 7. 포트 오픈
EXPOSE 8001


