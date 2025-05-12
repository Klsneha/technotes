import { EntityState } from "@reduxjs/toolkit/react";
import { MutationError, Note, Role, User } from "../../types";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { NOTE_TEXT_REGEX, NOTE_TITLE_REGEX, getError } from "../../common/common";
import { useAddNewNoteMutation, useDeleteNoteMutation, useUpdateNoteMutation } from "./NotesApiSlice";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

interface Props {
  users: EntityState<User, string> | undefined;
  note?: Note;
}
const NoteForm = ({ users, note }: Props) => {

  const { isAdmin, isManager } = useAuth();
 
  const [
    addNewNote,
    { 
      isLoading: addNoteLoading,
      isSuccess: addNoteSuccess,
      isError: addNoteIsError,
      error: addNoteError
    }
  ] = useAddNewNoteMutation();

  const [
    editNote,
    { 
      isLoading: editNoteLoading,
      isSuccess: editNoteSuccess,
      isError: editNoteIsError,
      error: editNoteError
    }
  ] = useUpdateNoteMutation();

  const [
    deleteNote,
    {
      isLoading: deleteNoteLoading,
      isSuccess: deleteNoteSuccess,
      isError: deleteNoteIsError,
      error: deleteNoteError
    }

  ] = useDeleteNoteMutation();;

  const isLoading = addNoteLoading ?? editNoteLoading ?? deleteNoteLoading;
  const isSuccess = addNoteSuccess || editNoteSuccess || deleteNoteSuccess;
  const isError = addNoteIsError || editNoteIsError || deleteNoteIsError;
  const error = addNoteError ?? editNoteError ?? deleteNoteError;
  
  const navigate = useNavigate();

  const [user, setUser] = useState<string>(note? note.user : "");
  const [title, setTitle] = useState<string>(note? note.title : "");
  const [validTitle, setValidTitle] = useState<boolean>(note ? true : false);
  const [text, setText] = useState<string>(note ? note.text : "");
  const [validText, setValidText] = useState<boolean>(note ? true : false);
  const [completed, setCompleted] = useState<boolean>(note ? note?.completed : false);

  useEffect(() => {
    if (note) {
      if (user !== note.user) {
        setUser(note.user);
      }
      if (title !== note.title) {
        setTitle(note.title);
      }
      if (text !== note.text) {
        setText(note.text);
      }
      if (completed !== note.completed) {
        setCompleted(note.completed);
      }
    }
   
  }, [note]);

  let canSave = [validTitle, validText].every(Boolean) && user && !isLoading; 
  const onUserSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (canSave) {
      if ( note) {
        await editNote({
          id: note.id,
          title,
          text,
          completed
        });
      } else {
        await addNewNote({ user, title, text, completed });
      }
    }
  }

  const onDeleteUserClicked =async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await deleteNote({ id: note?.id ?? "" });
  };

  useEffect(() => {
    setValidTitle(NOTE_TITLE_REGEX.test(title));
  }, [title]);

  useEffect(() => {
    setValidText(NOTE_TEXT_REGEX.test(text))
  }, [text]);

  useEffect(() => {
    if (isSuccess) {
        setTitle('')
        setText('')
        setUser("");
        navigate('/dashboard/notes')
    }
  }, [isSuccess, navigate]);

  const getUserOptions = () => {
    const options = Object.values(users?.entities ?? {}).map((user: User) => (
      <option
        key={user.id}
        value={user.id}
      >
        {user.userName}
      </option>
    ));
    options.unshift(
    <option
      key={"Select a user"}
      value={""}
    >
      {"Select a user"}
    </option>);
    return options;
  };

  const errClass = isError ? "errmsg" : "offscreen"
  const validTitleClass = !validTitle ? 'form__input--incomplete' : ''
  const validTextClass = !validText ? 'form__input--incomplete' : ''
  const validUserClass = !Boolean(user.length) ? 'form__input--incomplete' : ''

  const created = note?.createdAt ? new Date(note?.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }) : null;
  const updated = note?.updatedAt ? new Date(note?.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' }) : null;

  return (
    <>
      <p className={errClass}>{getError(error as MutationError)}</p>
      <form className="form" onSubmit={onUserSubmit}>
      <div className="form__title-row">
          {note ? (<h2>{`Edit Note ${note.ticket}`}</h2>) : <h2>New Note</h2>}
          <div className="form__action-buttons">
            <button
              className="icon-button"
              title="Save"
              disabled={!canSave}
            >
              <FontAwesomeIcon icon={faSave} />
            </button>
            {note &&
            (isAdmin || isManager) && (
              <button
                className="icon-button"
                title="Delete"
                onClick={onDeleteUserClicked}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            )}
          </div>
      </div>
      <label className="form__label" htmlFor="title">
          Title: <span className="nowrap">[3-20 letters]</span>
        </label>
        <input
          className={`form__input ${validTitleClass}`}
          id="title"
          name="title"
          type="text"
          autoComplete="off"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <label className="form__label" htmlFor="text">
          Text: <span className="nowrap">[100-200 letters]</span>
        </label>
        <textarea
          className={`form__textarea--text ${validTextClass}`}
          id="text"
          name="text"
          autoComplete="off"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />
        <div className="form__row">
          <div className="form__divider">
            <label className="form__label form__checkbox-container" htmlFor="is-completed">
              Work Complete:
                <input
                    className="form__checkbox"
                    id="completed"
                    name="completed"
                    type="checkbox"
                    checked={completed}
                    onChange={() => setCompleted(prev => !prev)}
                />
            </label>
            <label className="form__label" htmlFor="user">
              Assigned to:</label>
            <select
              className={`form__select ${validUserClass}`}
              id="user"
              name="user"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              disabled={!!note} // Disable if editing an existing note
            >{getUserOptions()}</select>
          </div>
          {note && (
            <div className="form__divider">
              <p className="form__created">Created:<br />{created}</p>
              <p className="form__updated">Updated:<br />{updated}</p>
            </div>
          )}
        </div>
        
       
        

    </form>
   </>
   
  );
};
export default NoteForm;