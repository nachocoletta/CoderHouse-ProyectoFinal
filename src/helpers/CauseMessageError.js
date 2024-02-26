export const generatorProductError = (product) => {
    return `Todos lo campos son requerios y deben ser validos.
  Lista de campos recibidos en la solicitud:
    - title         : ${product.title}
    - description   : ${product.description}
    - code          : ${product.code}
    - price         : ${product.price}
    - stock         : ${product.stock}
    - category      : ${product.category}
    `;
};

export const generatorUserIdError = (id) => {
    return `Se debe enviar un identificador valido.
  Valor recibido: ${id}`;
} 