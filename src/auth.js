import firebase from 'firebase'
import firebaseui from 'firebaseui'

const config = {
    apiKey: process.env.VUE_APP_apiKey,
    authDomain: process.env.VUE_APP_authDomain,
    databaseURL: process.env.VUE_APP_databaseURL,
    projectId: process.env.VUE_APP_projectId,
    storageBucket: process.env.VUE_APP_storageBucket,
    messagingSenderId: process.env.VUE_APP_messagingSenderId
}

const auth = {
    context: null,
    uiConfig: null,
    ui: null,
    
    init(context) {
        this.context = context;
        
        firebase.initializeApp(config);
        this.uiConfig = {
            signInSuccessUrl: 'dashboard',
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID    
            ]
        }
        
        this.ui = new firebaseui.authAuthUI(firebase.auth());
        
        firebase.auth().onAuthStateChanged((user) => {
            this.context.$store.dispatch('user/setCurrentUser')
            
            let requireAuth = this.context.$route.matched.some(record => record.meta.requireAuth)
            let guestOnly = this.context.$route.matched.some(record => record.meta.guestOnly)
            
            if(requireAuth && !user) this.context.$router.push('auth')
            else if (guestOnly && user) this.context.$router.push('dashboard')
        });
    },
    authForm(container){
        this.ui.start(container, this.uiConfig);
    },
    user() {
        return this.context ? firebase.auth().currentUser : null;
    },
    logout() {
        firebase.auth().signOut();
    }
}

export default auth;