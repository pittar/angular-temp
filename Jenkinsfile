try {
    def appName=env.APP_NAME
    def gitSourceUrl=env.GIT_SOURCE_URL
    def gitSourceRef=env.GIT_SOURCE_REF
    def gitContextDir=env.GIT_CONTEXT_DIR
    def project=""
    node("jenkins-slave-npm") {

        String projectQuery = sh (
            script: 'oc get projects',
            returnStdout: true
        ).trim()

        stage("Initialize") {
            project = env.PROJECT_NAME
            echo "appName: ${appName}"
            echo "gitSourceUrl: ${gitSourceUrl}"
            echo "gitSourceUrl: ${gitSourceUrl}"
            echo "gitSourceRef: ${gitSourceRef}"
            echo "gitContextDir: ${gitContextDir}"
            echo "Create projects..."
            openshift.withProject() {
                if (!projectQuery.contains(appName)) {
                    stage ('Creating Project') {
                        echo "Create a Project!"
                        // To grant the jenkins serviceaccount self provisioner cluster role run:
                        //$ oc adm policy add-cluster-role-to-user self-provisioner system:serviceaccount:cicd:jenkins -n cicd
                        print "Creating project ${appName}-dev"
                        sh "oc new-project ${appName}-dev"
                        print "Creating project ${appName}-qa"
                        sh "oc new-project ${appName}-qa"

                        print "Updating service account permissions"
                        sh "oc policy add-role-to-group edit developer -n ${appName}-dev"
                        sh "oc policy add-role-to-group edit developer -n ${appName}-qa"
                        sh "oc policy add-role-to-user system:image-puller system:serviceaccount:${appName}-dev:default -n cicd"
                        sh "oc policy add-role-to-user system:image-puller system:serviceaccount:${appName}-qa:default -n cicd"
                    }
                }
            }
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
                    echo "Begin binary s2i process."
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
        stage("Deploy DEV") {
            echo "Deploy to DEV."
            openshift.withCluster() {
                echo "Hello from ${openshift.cluster()}'s default project: ${openshift.project()}"
                openshift.withProject("${appName}-dev") {
                    def deploymentsExists = openshift.selector( "dc", "${appName}").exists()
                    if (!deploymentsExists) {
                            echo "Deployments do not yet exist.  Create the environment."
                            def models = openshift.process( "cicd//angular-app-template", "-p", "IMAGE_TAG=dev" )
                            def created = openshift.create( models )
                    }
                    echo "Rollout to DEV."
                    def dc = openshift.selector('dc', "${appName}")
                    dc.rollout().latest()
                    dc.rollout().status()
                }            
            }
        }
        stage("Integration Tests") {
        	echo "Running Integration tests..."
            // sh "mvn verify -Pfailsafe"
        }
        stage("Tag for QA") {
            echo "Tag to UAT"
            openshift.withCluster() {
                openshift.withProject('cicd') {
                    openshift.tag("${appName}:dev", "${appName}:qa")
                }
            }
        }
        stage("Deploy QA") {
            echo "Deploy to QA"
            openshift.withCluster() {
                openshift.withProject("${appName}-dev") {
                    def deploymentsExists = openshift.selector( "dc", "${appName}").exists()
                    if (!deploymentsExists) {
                            echo "Deployments do not yet exist.  Create the environment."
                            def models = openshift.process( "cicd//angular-app-template", "-p", "IMAGE_TAG=qa" )
                            def created = openshift.create( models )
                    }
                    echo "Rollout to QA."
                    def dc = openshift.selector('dc', "${appName}")
                    dc.rollout().latest()
                    dc.rollout().status()
                }            
            }
        }
    }
} catch (err) {
    echo "in catch block"
    echo "Caught: ${err}"
    currentBuild.result = 'FAILURE'
    throw err
}
