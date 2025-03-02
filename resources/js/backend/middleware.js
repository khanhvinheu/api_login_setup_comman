import router from './router/routes';
import store from '../store';
import { Message } from 'element-ui';
import { getToken } from '../utils/auth'; // get token from cookie
import getPageTitle from '../utils/get-page-title';
import { matchInArray } from '../utils/index';
import { USER_INFO, GENERATE_ROUTES, FED_LOGOUT } from '../store/muation-types';
import NProgress from 'nprogress'; // progress bar

NProgress.configure({ showSpinner: true }); // NProgress Configuration

const whiteList = store.state.settings.whiteList; // no redirect whitelist

router.beforeEach(async (to, from, next) => {  
  // start progress bar
  NProgress.start();
  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();
  if (hasToken) {   
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next(store.state.settings.redirect);          
      NProgress.done();
    } else {     
      // determine whether the user has obtained his permission roles through getInfo
      const hasRoles = store.getters.roles && store.getters.roles.length > 0;

      if (hasRoles) {      
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['manager','editor']         
          const { roles, permissions,ModuleDefault } = await store.dispatch(`user/${USER_INFO}`)          
          // generate accessible routes map based on roles
          const accessRoutes = await store.dispatch(`permission/${GENERATE_ROUTES}`, { roles, permissions });         
          router.addRoutes(router.options.routes);
          if(from.path ==='/login' && store.getters.user.ModuleDefault[0].path){
            next({path:store.getters.user.ModuleDefault[0].path, replace: true });
          }else{        
            let pathModule = store.getters.user.ArrayModule.map(e=>e.path)
            if(pathModule.includes(to.path)|| to.meta.type=='Form'){
              next({...to, replace: true });
            }else{
              if(to.path.includes('/check-file-in-pdf') || to.path.includes('/valid-qrcode')){
                next()
              }else{
                next({path:'/404'});
              }
              
            }
           
          }
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch(`user/${FED_LOGOUT}`);
          Message.error(error || 'Has Error');
          // next(`/login?redirect=${to.path}`);
          next(`/check-file-in-pdf`);

          NProgress.done();
        }
      }
    }
  } else {
    
   
    /* has no token*/
    if (matchInArray(to.path, whiteList)) {
      // in the free login whitelist, go directly
      next();
    } else {
      console.log(to.path);
      
      if(to.path.includes('/check-file-in-pdf') || to.path.includes('/valid-qrcode')){
        next()
      }else{
         // other pages that do not have permission to access are redirected to the login page.
        // next(`/login?redirect=${to.path}`);   
        next(`/check-file-in-pdf`);
      }
      
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
