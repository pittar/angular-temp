def appName=env.APP_NAME
def gitSourceUrl=env.GIT_SOURCE_URL
def gitSourceRef=env.GIT_SOURCE_REF
def gitContextDir=env.GIT_CONTEXT_DIR
def project=""
def projectVersion=""
def pomLocation="${env.GIT_CONTEXT_DIR}/pom.xml"
node("jenkins-slave-npm") {
    stage("Initialize") {
        project = env.PROJECT_NAME
        echo "appName: ${appName}"
        echo "gitSourceUrl: ${gitSourceUrl}"
        echo "gitSourceUrl: ${gitSourceUrl}"
        echo "gitSourceRef: ${gitSourceRef}"
    }
    stage("Checkout") {
        echo "Checkout source."
        git credentialsId: 'cicd-buildsecret', url: "${gitSourceUrl}", branch: "${gitSourceRef}"
    }
    stage("Build App") {
        sh "npm install"
        echo "Build the app."
        sh "npm run build"
    }
    stage("Build Image") {
        echo "Build container image."
        openshift.withCluster() {
            openshift.withProject('cicd') {
                echo "Current directory:"
                sh "pwd"
                echo "Listing this dir..."
                sh "ls -l"
                sh "oc start-build ${appName}-build --from-dir=./dist/record-linking-app  -n cicd --follow"
            }
        }
    }
    stage("Tag DEV") {
        echo "Tag image to DEV"
        openshift.withCluster() {
            openshift.withProject('cicd') {
                openshift.tag("${appName}:latest", "${appName}:dev")
            }
        }
    }
}
