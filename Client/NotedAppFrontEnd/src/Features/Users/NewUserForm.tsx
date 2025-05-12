import { useEffect, useState } from "react";
import { useAddNewUserMutation } from "./UsersApiSlice";
import { useNavigate } from "react-router-dom";
import { MutationError, Role } from "../../types";
import { PWD_REGEX, USER_REGEX, getError } from "../../common/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave } from "@fortawesome/free-solid-svg-icons";

const NewUserForm = () => {
  const [
    addNewUser,
    { isLoading, isSuccess, isError, error }
  ] = useAddNewUserMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState<string>('');
  const [validUsername, setValidUsername] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [validPassword, setValidPassword] = useState<boolean>(false);
  const [roles, setRoles] = useState<Role[]>([Role.EMPLOYEE]);

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username))
  }, [username]);

  useEffect(() => {
      setValidPassword(PWD_REGEX.test(password))
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
        setUsername('')
        setPassword('')
        setRoles([])
        navigate('/dashboard/users')
    }
  }, [isSuccess, navigate]);

  const onUsernameChanged = (e: React.ChangeEvent<HTMLInputElement>)  => setUsername(e.target.value)
  const onPasswordChanged = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)

  const onUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const values = Array.from(
          e.target.selectedOptions, //HTMLCollection 
          (option) => option.value as Role
      )
      setRoles(values)
  }

  const errClass = isError ? "errmsg" : "offscreen"
  const validUserClass = !validUsername ? 'form__input--incomplete' : ''
  const validPwdClass = !validPassword ? 'form__input--incomplete' : ''
  const validRolesClass = !Boolean(roles.length) ? 'form__input--incomplete' : ''

  const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading

  const onSaveUserClicked = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (canSave) {
        await addNewUser({ userName: username, password, roles })
    }
  };

  const options = Object.values(Role).map(role => {
    return (
      <option
          key={role}
          value={role}

      > {role}</option >
    )
})

  const content = (
    <>
      <p className={errClass}>{getError(error as MutationError)}</p>

        <form className="form" onSubmit={onSaveUserClicked}>
            <div className="form__title-row">
                <h2>New User</h2>
                <div className="form__action-buttons">
                    <button
                        className="icon-button"
                        title="Save"
                        disabled={!canSave}
                    >
                        <FontAwesomeIcon icon={faSave} />
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
                    Password: <span className="nowrap">[4-12 chars incl. !@#$%]</span></label>
                <input
                    className={`form__input ${validPwdClass}`}
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={onPasswordChanged}
                />

                <label className="form__label" htmlFor="roles">
                    ASSIGNED ROLES:</label>
                <select
                    id="roles"
                    name="roles"
                    className={`form__select ${validRolesClass}`}
                    multiple={true}
                    size={3}
                    value={roles}
                    onChange={onUserChange}
                > {options}</select>

            </form>
        </>
    )

    return content
}
export default NewUserForm;