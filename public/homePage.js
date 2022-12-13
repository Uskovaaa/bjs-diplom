//выход из личного кабинета
const logoutButton = new LogoutButton();
logoutButton.action = function() {
  ApiConnector.logout(response => {
    if (response.success) {
      location.reload();
    }
  });
}

//получение информации о пользователе
ApiConnector.current(response => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

//получение текущих курсов валют
const ratesBoard = new RatesBoard();
ApiConnector.getStocks(response => {
  if (response.success) {
    ratesBoard.fillTable(response.data);
    setInterval(() => {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }, 60000);
  }
});

/**
 * Операции с деньгами
 * пополнение баланса
*/
const moneyManager = new MoneyManager();
moneyManager.addMoneyCallback = data => {
  ApiConnector.addMoney(data, response => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, response.error = "Успешное пополнение баланса");
    }
    moneyManager.setMessage(response.success, response.error);
  });
}

//конвертирование валюты
moneyManager.conversionMoneyCallback = data => {
  ApiConnector.convertMoney(data, response => {
    if(response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, response.error = "Успешное конвертирование валюты");
    }
    moneyManager.setMessage(response.success, response.error);
  });
}

//перевод средств
moneyManager.sendMoneyCallback = data => {
  ApiConnector.transferMoney(data, response => {
    if(response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, response.error = "Средства отправлены");
    }
    moneyManager.setMessage(response.success, response.error);
  });
}

/**
 * Работа с избранными
*/
const favoritesWidget = new FavoritesWidget();
ApiConnector.getFavorites(response => {
  if(response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  }
})

favoritesWidget.addUserCallback = data => {
  ApiConnector.addUserToFavorites(data, response => {
    if(response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(response.success, response.error = "Избранный добавлен");
    }
    favoritesWidget.setMessage(response.success, response.error);
  });
}

favoritesWidget.removeUserCallback = data => {
  ApiConnector.removeUserFromFavorites(data, response => {
    if(response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(response.success, response.error = "Избранный удалён");
    }
    favoritesWidget.setMessage(response.success, response.error);
  });
}

