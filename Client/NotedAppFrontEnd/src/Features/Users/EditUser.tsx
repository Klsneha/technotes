import { useEffect, useState } from "react";
import { selectUserById, useDeleteUserMutation, useUpdateUserMutation } from "./UsersApiSlice";
import { useNavigate } from "react-router-dom";
import { MutationError, Role } from "../../types";
import { PWD_REGEX, USER_REGEX, getError } from "../../common/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";

const EditUser = () => {

  const { id } = useParams();

  const userDetails  = useSelector((state) => selectUserById(state, id ?? ""));


  const [
    editUser,
    { isLoading, isSuccess, isError, error }
  ] = useUpdateUserMutation();

  const [ deleteUser,
    { isLoading: isLoadingDelete,
      isSuccess: isSuccesDelete,
      isError: isErrorDelete,
      error: errorDelete
    }
  ] = useDeleteUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState<string>(userDetails?.userName);
  const [validUsername, setValidUsername] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>(userDetails?.roles);
  const [active, setActive] = useState<boolean>(Boolean(userDetails?.active))

  useEffect(() => {
    if (username !== userDetails?.userName) {
      setUsername(userDetails?.userName);
    }
  }, [userDetails?.userName]);

  useEffect(() => {
    setRoles(userDetails?.roles);
  }, [userDetails?.roles]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username]);

  useEffect(() => {
      setValidPassword(PWD_REGEX.test(password))
  }, [password]);

  useEffect(() => {
    if (isSuccess || isSuccesDelete) {
        setUsername('')
        setPassword('')
        setRoles([])
        setActive(false);
        navigate('/dashboard/users')
    }
  }, [isSuccess, isSuccesDelete, navigate]);

  const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>)  => setUsername(e.target.value)
  const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

  const onRolesChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const values = Array.from(
          e.target.selectedOptions, //HTMLCollection 
          (option) => option.value as Role
      )
      setRoles(values)
  }

  const errClass = (isError || isErrorDelete) ? "errmsg" : "offscreen"
  const validUserClass = !validUsername ? 'form__input--incomplete' : ''
  const validPwdClass = password && !validPassword ? 'form__input--incomplete' : ''
  const validRolesClass = !Boolean(roles?.length) ? 'form__input--incomplete' : ''

  let canSave: boolean = false;
  if (password) {
      canSave = [roles?.length, validUsername, validPassword].every(Boolean) && !isLoading
  } else {
      canSave = [roles?.length, validUsername].every(Boolean) && !isLoading
  }

  const onSaveUserClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (canSave) {
        await editUser({ userName: username, password, roles, id, active });
    }
  };

  const onDeleteUserClicked = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    await deleteUser({ id: id ?? "" });
  };

  const options = Object.values(Role).map(role => {
    return (
      <option
          key={role}
          value={role}

      > {role}</option >
    )
})

const onActiveChanged = () => setActive(prev => !prev)

  const content = (
    <>
      <p className={errClass}>{getError((error ?? errorDelete) as MutationError)}</p>

        <form className="form" onSubmit={onSaveUserClicked}>
            <div className="form__title-row">
                <h2>Edit User</h2>
                <div className="form__action-buttons">
                    <button
                        className="icon-button"
                        title="Save"
                        disabled={!canSave}
                    >
                        <FontAwesomeIcon icon={faSave} />
                    </button>
                    <button
                      className="icon-button"
                      title="Delete"
                      onClick={onDeleteUserClicked}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                    </button>
                </div>
            </div>
            <label className="form__label" htmlFor="username">
                Username: <span className="nowrap">[3-20 letters]</span></label>
            <input
                className={`form__input ${validUserClass}`}
                id="username"
                name="username"
                type="text"
                autoComplete="off"
                value={username}
                onChange={onUsernameChanged}
            />
            <label className="form__label" htmlFor="password">
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span>
            </label>
            <input
                className={`form__input ${validPwdClass}`}
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={onPasswordChanged}
            />


            <label className="form__label form__checkbox-container" htmlFor="user-active">
                    ACTIVE:
                    <input
                        className="form__checkbox"
                        id="user-active"
                        name="user-active"
                        type="checkbox"
                        checked={active}
                        onChange={onActiveChanged}
                    />
                </label>

            <label className="form__label" htmlFor="roles">
                ASSIGNED ROLES:</label>
            <select
                id="roles"
                name="roles"
                className={`form__select ${validRolesClass}`}
                multiple={true}
                size={3}
                value={roles}
                onChange={onRolesChanged}
            > {options}</select>

            </form>
        </>
    )

    return content
};
export default EditUser;