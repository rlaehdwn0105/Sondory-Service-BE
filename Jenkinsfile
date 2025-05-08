pipeline {
  agent any

  environment {
    DOCKER_REGISTRY    = 'dongjukim123/soundory-be'
    DOCKER_CREDENTIALS = 'dockerhub-token'
    GITHUB_CREDENTIALS = 'github-token'
    GITHUB_REPO_URL    = 'https://github.com/rlaehdwn0105/Sondory-Service-BE.git'
    GITHUB_BRANCH      = 'main'
    GIT_USER_EMAIL     = 'dongju08@naver.com'
    GIT_USER_NAME      = 'rlaehdwn0105'
  }

  stages {

    stage('Check Changed Files') {
      steps {
        script {
          def changedFiles = sh(
            script: "git diff --name-only HEAD~1 HEAD || true",
            returnStdout: true
          ).trim().split("\n")

          def shouldRun = changedFiles.any { it.startsWith("src/") }

          if (!shouldRun) {
            echo "No changes in src/, skipping pipeline."
            currentBuild.result = 'NOT_BUILT'
            error('Pipeline skipped due to no src/ changes')
          } else {
            echo "Detected change in src/, proceeding with pipeline."
          }
        }
      }
    }

    stage('Checkout') {
      steps {
        checkout([$class: 'GitSCM',
          branches: [[name: "refs/heads/${env.GITHUB_BRANCH}"]],
          userRemoteConfigs: [[
            url: "${env.GITHUB_REPO_URL}",
            credentialsId: "${env.GITHUB_CREDENTIALS}"
          ]]
        ])
      }
      post {
        success {
          echo 'Repository clone success!'
        }
        failure {
          echo 'Repository clone failure!'
        }
      }
    }

    stage('Docker Build') {
      steps {
        sh """
          docker build -t ${DOCKER_REGISTRY}:${BUILD_NUMBER} .
          docker tag ${DOCKER_REGISTRY}:${BUILD_NUMBER} ${DOCKER_REGISTRY}:latest
        """
      }
      post {
        success {
          echo 'Docker image build success!'
        }
        failure {
          echo 'Docker image build failure!'
        }
      }
    }

    stage('Docker Push') {
      steps {
        withDockerRegistry(credentialsId: "${DOCKER_CREDENTIALS}", url: '') {
          sh """
            docker push ${DOCKER_REGISTRY}:${BUILD_NUMBER}
            docker push ${DOCKER_REGISTRY}:latest
          """
          sleep 10
        }
      }
      post {
        success {
          echo 'Docker image push success!'
          sh """
            docker rmi ${DOCKER_REGISTRY}:${BUILD_NUMBER} || true
            docker rmi ${DOCKER_REGISTRY}:latest || true
          """
        }
        failure {
          echo 'Docker image push failure!'
          sh """
            docker rmi ${DOCKER_REGISTRY}:${BUILD_NUMBER} || true
            docker rmi ${DOCKER_REGISTRY}:latest || true
          """
        }
      }
    }

    stage('Update Helm values & Git Push') {
      steps {
        sh 'mkdir -p gitOpsRepo'
        dir('gitOpsRepo') {
          git branch: "${GITHUB_BRANCH}",
              credentialsId: "${GITHUB_CREDENTIALS}",
              url: "${GITHUB_REPO_URL}"

          sh "git config --global user.email '${GIT_USER_EMAIL}'"
          sh "git config --global user.name '${GIT_USER_NAME}'"

          sh "sed -i 's|tag: .*|tag: ${BUILD_NUMBER}|' helm-chart/my-backend/values.yaml"

          script {
            def currentTag = sh(
              script: "grep 'tag:' helm-chart/my-backend/values.yaml | awk '{print \$2}'",
              returnStdout: true
            ).trim()

            if (currentTag == BUILD_NUMBER.toString()) {
              echo "Tag is already ${BUILD_NUMBER}, skipping git push to avoid loop."
            } else {
              sh "git add helm-chart/my-backend/values.yaml"
              sh "git commit -m 'ci: rollout to image build #${BUILD_NUMBER}' || echo 'No changes to commit'"

              withCredentials([gitUsernamePassword(credentialsId: "${GITHUB_CREDENTIALS}", gitToolName: 'git-tool')]) {
                sh "git remote set-url origin https://${GITHUB_CREDENTIALS}@github.com/rlaehdwn0105/Sondory-Service-BE.git"
                sh "git push origin ${GITHUB_BRANCH}"
              }
            }
          }
        }
      }
      post {
        success {
          echo 'Helm values.yaml updated successfully!'
        }
        failure {
          echo 'Helm update failed!'
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline completed successfully!'
    }
    failure {
      echo 'Pipeline failed during execution!'
    }
  }
}
