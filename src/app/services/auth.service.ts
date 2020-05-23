
import { UsuarioModel } from './../models/usuario.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://identitytoolkit.googleapis.com/v1/accounts';
  private apiKey = "AIzaSyDh3-UwEX4ziu3zUAdkhKEqk0ZIAjG93UM";
  userToken: string;
  expiresIn: string;

  //crear nuevo usuario
  //https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=[API_KEY]
  //hacer login
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[API_KEY]

  constructor(private http: HttpClient) {
    this.leerToken();
  }

  logout() {
    localStorage.removeItem('token');
  }

  login(usuario: UsuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true
    }
    // we need to pass the url and the dataObject with the data
    return this.http.post(`${this.url}:signInWithPassword?key=${this.apiKey}`, authData).pipe(
      map((resp) => {
        this.guardarToken(resp['idToken']);
        this.expiresIn = resp['expiresIn'];
        //hacemos el retorn para que map() no bloquee la respuesta original que deseamos mandar
        return resp;
      })
    );
  }

  nuevoUsuario(usuario: UsuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true
    }
    // we need to pass the url and the dataObject with the data
    return this.http.post(`${this.url}:signUp?key=${this.apiKey}`, authData).pipe(
      map((resp) => {
        this.guardarToken(resp['idToken']);
        this.expiresIn = resp['expiresIn'];
        //hacemos el retorn para que map() no bloquee la respuesta original que deseamos mandar
        return resp;
      })
    );
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
    //vamos a verificar si el token ya expiro en base al tiempo que se creo
    let hoy = new Date();
    //tiempo de duracion del token y lo asignamos al local storage
    hoy.setSeconds(Number(this.expiresIn));
    localStorage.setItem('expira', hoy.getTime().toString());
  }

  leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  estaAutenticado(): boolean {
    //vamos a verificar si el token ya expiro en base al tiempo que se creo
    if (this.userToken.length < 2) {
      return false;
    }
    const expira = Number(localStorage.getItem('expira'));
    //fecha en la que el token expira
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    //validar para ver si el token ya expiro
    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }

}
