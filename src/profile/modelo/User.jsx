
export default class User {
  constructor({ id, nombre, email, foto, reservas = [], password }) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.foto = foto;
    this.reservas = reservas;
    this.password = password;
  }

  static fromJson(json) {
    return new User({
      id: json.id,
      nombre: json.nombre,
      email: json.email,
      foto: json.foto,
      reservas: json.reservas || [],
      password: json.password,
    });
  }

  toJson() {
    return {
      id: this.id,
      nombre: this.nombre,
      email: this.email,
      foto: this.foto,
      reservas: this.reservas,
      password: this.password,
    };
  }
}
