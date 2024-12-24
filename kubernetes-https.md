Yes, it is entirely possible to use Let's Encrypt for HTTPS in a Kubernetes environment, and you can set it up for automatic renewal as well. Here's how you can do it:

### Using Cert-Manager

**Cert-Manager** is a popular Kubernetes add-on that automates the management and issuance of TLS certificates from various issuing sources, including Let's Encrypt.

#### Steps to Set Up Let's Encrypt with Cert-Manager

1. **Install Cert-Manager**:
   You can install Cert-Manager using `kubectl` with the provided manifest from Cert-Manager's official website or use Helm.

   Using `kubectl`:
   ```bash
   kubectl apply -f https://github.com/cert-manager/cert-manager/releases/latest/download/cert-manager.yaml
   ```

   Or using Helm:
   ```bash
   helm repo add jetstack https://charts.jetstack.io
   helm repo update
   helm install cert-manager jetstack/cert-manager --namespace cert-manager --create-namespace --version vX.Y.Z # Replace with the latest version
   ```

2. **Create a ClusterIssuer or Issuer**:
   You need to define how Cert-Manager will request certificates. For Let's Encrypt, this is typically done with a **ClusterIssuer**.

   Example ClusterIssuer YAML:
   ```yaml
   apiVersion: cert-manager.io/v1
   kind: ClusterIssuer
   metadata:
     name: letsencrypt-prod
   spec:
     acme:
       # You must replace this with the ACME server URL for Let's Encrypt
       server: https://acme-v02.api.letsencrypt.org/directory
       email: your-email@example.com # Your email for Let's Encrypt notifications
       privateKeySecretRef:
         name: letsencrypt-prod # Secret to store the private key
       solvers:
       - http01:
           ingress:
             class: nginx # Specify your ingress class (nginx, traefik, etc.)
   ```

3. **Create a Certificate Resource**:
   After setting up the issuer, you can create a certificate resource that specifies which domain to secure.

   Example Certificate YAML:
   ```yaml
   apiVersion: cert-manager.io/v1
   kind: Certificate
   metadata:
     name: my-cert
     namespace: my-namespace
   spec:
     secretName: my-cert-secret # Secret where cert will be stored
     issuerRef:
       name: letsencrypt-prod
       kind: ClusterIssuer
     commonName: mydomain.com
     dnsNames:
     - mydomain.com
     - www.mydomain.com
   ```

4. **Configure Ingress**:
   Ensure your Ingress resource uses the certificate. For example:

   ```yaml
   apiVersion: networking.k8s.io/v1
   kind: Ingress
   metadata:
     name: my-ingress
     annotations:
       cert-manager.io/issuer: "letsencrypt-prod"
   spec:
     tls:
     - hosts:
       - mydomain.com
       - www.mydomain.com
       secretName: my-cert-secret
     rules:
     - host: mydomain.com
       http:
         paths:
         - path: /
           pathType: Prefix
           backend:
             service:
               name: my-service
               port:
                 number: 80
   ```

5. **Automatic Renewal**:
   Cert-Manager will automatically handle certificate renewal. Certificates issued by Let's Encrypt typically expire after 90 days, but Cert-Manager will renew them automatically when they are close to expiration (usually within 30 days).

### Key Points

- **Domain Verification**: Ensure your domain is pointed to your Kubernetes cluster to pass the Let's Encrypt domain verification.
- **Email Notifications**: Register an email to receive notifications about certificate expiration.
- **Persistent Store**: You may want to have a persistent volume for cert-manager's storage if you're concerned about data persistence.

With this setup, you can leverage Let's Encrypt certificates in your Kubernetes environment, ensuring secure HTTPS access and automatic renewal in production. If you have any specific questions or need further assistance, feel free to ask!
