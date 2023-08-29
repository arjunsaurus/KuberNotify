const k8s = require('@kubernetes/client-node');

const kc = new k8s.KubeConfig();
kc.loadFromDefault();

const k8sApi = kc.makeApiClient(k8s.CoreV1Api);

const metricsController = {};
//all these console.logs should be sending the data to a sql database instead



metricsController.getPods = (res, req, next) => {
    //should console.log each individual pod right now
    console.log("In getPods middlware right now")
    k8sApi.listPodForAllNamespaces().then((res) => {
        console.log('Pods in all namespaces:');
        res.body.items.forEach((pod) => {
            console.log(`${pod.metadata.namespace}/${pod.metadata.name}`);
        });
        return next();
    })
    .catch((err) => {
        console.error('Error:', err);
    });  
};

metricsController.getNodes = (res, req, next) => {
    k8sApi.listNode().then((res) => {
        console.log('Nodes:');
        res.body.items.forEach((node) => {
            console.log(node.metadata.name);
        });
        return next();
    })
    .catch((err) => {
        console.error('Error:', err);
    });
};

metricsController.getContainers = (res, req, next) => {
    //queries for every pod, then pulls each container out of the pod and lists each individually...this will probably have to move to a sql database
    k8sApi.listPodForAllNamespaces().then((res) => {
        console.log('Containers in all namespaces:');
        
        res.body.items.forEach((pod) => {
            // each of these pods can/will have multiple containers so we have to iterate through it again
            const containers = pod.spec.containers;
            containers.forEach((container) => {
                console.log(`Namespace: ${pod.metadata.namespace}, Pod: ${pod.metadata.name}, Container: ${container.name}`);
            });
        });
        return next();
    })
    .catch((err) => {
        console.error('Error:', err);
    });
};

module.exports = metricsController;