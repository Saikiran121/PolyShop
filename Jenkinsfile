def services = [
    'analytics-service',
    'cart-service',
    'frontend-service',
    'inventory-service',
    'notification-service',
    'order-service',
    'payment-service',
    'product-service',
    'review-service',
    'shipping-service',
    'user-service'
]

pipeline {
    agent any 

    stages {
        stage('Build and Test') {
            steps {
                script {
                    for (service in services) {
                        echo "Processing ${service}"

                        dir(service) {
                            if (fileExists('pom.xml')) {
                                sh 'mvn test'
                            }
                            else if (fileExists('build.gradle')) {
                                sh 'gradle test'
                            }
                            else if (fileExists('package.json')) {
                                sh 'npm test'
                            }
                        }
                    }
                }
            }
        } 
    } 
}