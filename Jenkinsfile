pipeline {
  agent any

  environment {
    dockerHubRegistry = 'dongjukim123/soundory-be'
    dockerHubRegistryCredential = 'dockerhub-token'
    githubCredential = 'github-token'
    gitEmail = 'rlaehdwn0105@gmail.com'
    gitName = 'rlaehdwn0105'
  }

  stages {
    
    stage('Checkout from GitHub') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [[name: '*/main']],
          userRemoteConfigs: [[
            url: 'https://github.com/rlaehdwn0105/Sondory-Service-BE.git',
            credentialsId: githubCredential
          ]]
        ])
      }
    }

    stage('Docker Build') {
      steps {
        sh """
          docker build -t ${dockerHubRegistry}:${currentBuild.number} .
          docker tag ${dockerHubRegistry}:${currentBuild.number} ${dockerHubRegistry}:latest
          docker tag ${dockerHubRegistry}:${currentBuild.number} ${dockerHubRegistry}:canary
        """
      }
    }

    stage('Docker Push') {
      steps {
        withDockerRegistry(credentialsId: dockerHubRegistryCredential, url: '') {
          sh """
            docker push ${dockerHubRegistry}:${currentBuild.number}
            docker push ${dockerHubRegistry}:latest
            docker push ${dockerHubRegistry}:canary
          """
        }
      }
    }

    stage('Update K8S Manifest') {
      steps {
        sh "git config --global user.email '${gitEmail}'"
        sh "git config --global user.name '${gitName}'"

        // 이미지 태그 변경 (경로에 맞게 수정해줘)
        sh "sed -i 's|soundory-be:.*|soundory-be:${currentBuild.number}|g' k8s/deploy.yaml"

        sh """
          git add .
          git commit -m 'chore: Update image tag to ${currentBuild.number}'
          git push https://${gitName}:${GITHUB_TOKEN}@github.com/rlaehdwn0105/Sondory-Service-BE.git HEAD:main
        """
      }
    }
  }

  post {
    success {
      echo '✅ CI 성공: Docker 이미지 빌드 및 푸시, Manifest 업데이트 완료'
    }
    failure {
      echo '❌ CI 실패: 확인 필요'
    }
  }
}
