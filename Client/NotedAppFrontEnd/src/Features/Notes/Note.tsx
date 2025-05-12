import { useSelector } from "react-redux";
import { selectNoteById } from "./NotesApiSlice";
import { Note } from "../../types";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { selectUserById } from "../Users/UsersApiSlice";

interface NoteProps {
  noteId: string;
}

const NoteDetails = ({ noteId }: NoteProps) => {
  const note: Note = useSelector((state) => selectNoteById(state, noteId));
  const navigate = useNavigate();

  if (!note) return null;

  const userDetails = useSelector((state) => selectUserById(state, note.user));

  const created = new Date(note.createdAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })
  const updated = new Date(note.updatedAt).toLocaleString('en-US', { day: 'numeric', month: 'long' })

  const handleEdit = () => navigate(`/dashboard/notes/${noteId}`)

  return (
    <tr className="table__row">
        <td className="table__cell note__status">
            {note.completed
                ? <span className="note__status--completed">Completed</span>
                : <span className="note__status--open">Open</span>
            }
        </td>
        <td className="table__cell note__created">{created}</td>
        <td className="table__cell note__updated">{updated}</td>
        <td className="table__cell note__title">{note.title}</td>
        <td className="table__cell note__username">{userDetails?.userName ?? note.user}</td>

        <td className="table__cell">
            <button
                className="icon-button table__button"
                onClick={handleEdit}
            >
                <FontAwesomeIcon icon={faPenToSquare} />
            </button>
        </td>
    </tr>
)
};
export default NoteDetails;