# TP3

## Question 1

`<Navigate />` est utilisé pour faire une redirection directement pendant le rendu du composant.  
`navigate()` est une fonction utilisée après une action (clic, formulaire, etc.) pour changer de route.

Donc, `<Navigate />` est déclaratif dans le rendu, tandis que `navigate()` est utilisé dans la logique du code.

## Question 2

`navigate(from)` ajoute une nouvelle entrée dans l’historique du navigateur. L’utilisateur peut donc revenir à la page précédente avec le bouton back.
`navigate(from, { replace: true })` remplace la page actuelle dans l’historique au lieu d’en ajouter une nouvelle. L’utilisateur ne pourra donc pas revenir à la page précédente avec le bouton back.

## Question 3

Après un POST, on fait `setProjects(prev => [...prev, data])` pour ajouter directement le nouveau projet dans l’état local sans refaire une requête GET.
Cela évite un appel réseau supplémentaire et rend l’interface plus rapide.

## Question 4 

### a) /dashboard sans être connecté

On ne peut pas accéder à la page `dashboard` car aucun utilisateur n’est présent dans le state global du context, donc la route est protégée et redirige vers la page de login.

### b) /projects/1

Même chose : sans utilisateur authentifié dans le context global, l’accès à la route est refusé et l’utilisateur est redirigé vers la page de connexion.

### c) /nimportequoi

Si l’utilisateur accède à une route qui n’existe pas, il est redirigé vers `dashboard`.
`            <Route path="*" element={<Navigate to="/dashboard" replace />} />`

### d) / (racine)

La racine redirige généralement vers la page principale de l’application, le `dashboard` si l’utilisateur est connecté, ou la page de login sinon.
`       <Route path="/" element={<Navigate to="/dashboard" replace />} />`

### e) Connecté puis bouton Retour du navigateur

Lorsque l’utilisateur se connecte, la redirection vers le `dashboard` utilise `replace: true`.  
Ainsi, la page de login est remplacée dans l’historique, donc en appuyant sur le bouton retour du navigateur, l’utilisateur reste sur le `dashboard`.

## Question 5

`<Link>` permet simplement de naviguer vers une autre route.

`<NavLink>` fait la même chose mais permet aussi de savoir si la route est active (`isActive`) afin d’appliquer un style différent.

On utilise donc `NavLink` ici pour pouvoir mettre en évidence le projet actuellement ouvert dans la sidebar avec la classe `.active`.

## Question 6

La différence est que le **POST** sert à créer un nouveau projet, tandis que le **PUT** sert à modifier un projet existant.

Avec POST, le formulaire envoie de nouvelles données pour créer une ressource.  
Avec PUT, le formulaire charge d'abord les données du projet existant puis envoie la mise à jour.

## Question 7

Si on arrête **json-server** et qu’on tente un POST, le message d’erreur `net::ERR_CONNECTION_REFUSED` s’affiche dans la console du navigateur.

Cela arrive parce que le serveur n’écoute plus sur `http://localhost:4000/projects`, donc la requête ne peut pas aboutir.

## Question 8


Avec **Axios**, une réponse 404 (ou toute autre erreur HTTP ≥ 400) **lance une exception** qui peut être capturée dans un `try/catch` ou un `.catch()`.

Avec **fetch**, une réponse 404 ne génère pas d’erreur automatiquement ; il faut vérifier `response.ok` pour détecter les erreurs.
