import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { resetPassword } from '../utils/AuthService';
import Loader from '../components/Loader';
import Modal from '../components/Modal';

function ResetPasswordPage() {
  const { resetkey } = useParams()
  const navigate = useNavigate()
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [buttonEnabled, setButtonEnabled] = useState();
  const [isWaiting, setIsWaiting] = useState(false)
  const [responseStatus, setResponseStatus] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("")
  const [modalMsg, setModalMsg] = useState("")


  useEffect(() => {
    if (password === confirmation && password.length > 7) {
      setButtonEnabled(true);
    } else {
      setButtonEnabled(false);
    }
  }, [password, confirmation]);

  const sendResetPasswordRequest = async () => {
    setIsWaiting(true)
    try {
      const res = await resetPassword(resetkey, password);
      if (res.status === 200) {
        setResponseStatus("success")
        setModalTitle("パスワード再設定が完了しました")
        setModalMsg("ログインページよりログインを行ってください")
        setIsWaiting(false)
        setShowModal(true)
      }
    } catch (error) {
      setResponseStatus("failed")
      setModalTitle("予期せぬエラーが起きました")
      setModalMsg("管理者にお問合せください")
      setIsWaiting(false)
      setShowModal(true)
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    sendResetPasswordRequest();
  }

  function onConfirm() {
    setShowModal(false)
    navigate("/login");
    window.location.reload(false);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-100">
      <form
        className="p-10 bg-white w-96 rounded-xl drop-shadow-xl"
        onSubmit={submitHandler}
      >
        <p className="text-center">新しいパスワードを設定してください</p>
        <p className="text-center">（半角英数8文字以上）</p>
        <div className="py-2" />
        <InputField
          type="password"
          label="新しいパスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="py-3" />
        <InputField
          type="password"
          label="新しいパスワード（確認用）"
          value={confirmation}
          onChange={(e) => setConfirmation(e.target.value)}
        />
        <div className="py-3" />
        <div className="flex justify-center">
          <Button
            title="パスワードを再設定する"
            disabled={!buttonEnabled}
          />
        </div>
      </form>
      {isWaiting ? (
        <Loader />
      ) : null
      }
      {showModal ? (
        <Modal
          open={showModal}
          title={modalTitle}
          msg={modalMsg}
          status={responseStatus}
          onConfirm={onConfirm}
        />
      ) : null}
    </div>

  )
}
export default ResetPasswordPage;
