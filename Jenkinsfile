pipeline {
  agent any

  environment {
    dockerHubRegistry = 'dongjukim123/soundory-be'
    dockerHubRegistryCredential = 'dockerhub-token'
    githubCredential = 'github-token'
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

  }

  post {
    success {
      echo 'CI 성공: Docker 이미지 빌드 및 푸시 완료'
    }
    failure {
      echo 'CI 실패: 확인 필요'
    }
  }
}
