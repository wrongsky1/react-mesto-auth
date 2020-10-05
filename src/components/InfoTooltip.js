import React from 'react';
import PopupWithForm from './PopupWithForm';
import registerSuccess from '../images/login-success.svg';
import loginFail from '../images/login-fail.svg';

function InfoTooltip({ success, message }) {
  const [isOpenInfoTool, setIsOpenInfoTool] = React.useState(true);
  const handleClose = () => {
    setIsOpenInfoTool(false);
  };
  return (
    <PopupWithForm
      name="tool-tip"
      isForm={false}
      isOpen={isOpenInfoTool}
      onClose={handleClose}
    >
      <img className="tool-tip__image" src={success ? registerSuccess : loginFail} alt={success ? 'Инфо картинка об успешной регистрации' : 'Инфо-картинка о неудачной попытке ввода данных'} />
      <h2 className="tool-tip__title">{success ? 'Вы успешно зарегистировались!' : 'Что-то пошло не так! Попробуйте еще раз.' }</h2>
    </PopupWithForm>
  );
}

export default InfoTooltip;