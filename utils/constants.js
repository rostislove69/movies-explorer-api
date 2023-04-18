const statusCodes = {
  ok: 200,
  created: 201,
  notFound: 404,
};

const messages = {
  deleted: 'Фильм успешно удален',
  notDeleted: 'Вы не можете удалить чужой фильм',
  badRequest: 'Переданы некорректные данные',
  cardNotFound: 'Фильм не найден',
  userNotFound: 'Такого пользователя не существует',
  pageNotFound: 'Такой страницы не существует',
  serverError: 'На сервере произошла ошибка',
  userAlredyCreated: 'Пользователь с таким email уже зарегистрирован',
  needAuth: 'Необходима авторизация',
  loginFailed: 'Неправильные почта или пароль',
};

module.exports = {
  statusCodes,
  messages,
};
