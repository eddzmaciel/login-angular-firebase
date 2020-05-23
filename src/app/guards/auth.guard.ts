
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './../services/auth.service';

@Injectable({
  providedIn: 'root'
})
//al implementar CanActivate, es la instruccion que se va a encargar 
//de verificar si la ruta se puede o no ejecutar
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }
  //contiene cual es la siguiente ruta a cual el usuario quiere navegar
  //puede retornar un observable que resuelva un booleano
  canActivate(): boolean {
    console.log('Guard');
    if (this.auth.estaAutenticado()) {
      return true;
    }
    else {
      this.router.navigateByUrl('/login');
      //siempre tenemos que regresar o true o false
      return false;
    }

  }

}
