import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSendLogoutMutation } from "../Features/Auth/AuthApiSlice";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
	faRightFromBracket,
	faFileCirclePlus,
	faFilePen,
	faUserGear,
	faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import useAuth from '../hooks/useAuth'


const DASH_REGEX = /^\/dashboard(\/)?$/
const NOTES_REGEX = /^\/dashboard\/notes(\/)?$/
const USERS_REGEX = /^\/dashboard\/users(\/)?$/

export const DashboardHeader: React.FC = () => {

	const navigate = useNavigate()
	const { pathname } = useLocation();
	const { isManager, isAdmin } = useAuth();

	const [sendLogout, {
			isLoading,
			isSuccess,
			isError,
			error
	}] = useSendLogoutMutation();

	const onNewNoteClicked = () => navigate('/dashboard/notes/new')
	const onNewUserClicked = () => navigate('/dashboard/users/new')
	const onNotesClicked = () => navigate('/dashboard/notes')
	const onUsersClicked = () => navigate('/dashboard/users')


const handleLogout = async () => {
  try {
    await sendLogout().unwrap();
    navigate('/'); // move to homepage only on success
  } catch (err) {
    console.error("Logout failed", err);
  }
};

	console.log("** isSuccess", isSuccess);

	useEffect(() => {
			if (isSuccess) navigate('/')
	}, [isSuccess, navigate]);

	if (isLoading) return <p>Logging Out...</p>

	if (isError) return <p>Error: {(error as any).data?.message}</p>

	let dashClass = null
	if (!DASH_REGEX.test(pathname) && !NOTES_REGEX.test(pathname) && !USERS_REGEX.test(pathname)) {
			dashClass = "dash-header__container--small"
	}

	let newNoteButton = null
	if (NOTES_REGEX.test(pathname)) {
			newNoteButton = (
					<button
							className="icon-button"
							title="New Note"
							onClick={onNewNoteClicked}
					>
							<FontAwesomeIcon icon={faFileCirclePlus} />
					</button>
			)
	}

	let newUserButton = null
	if (USERS_REGEX.test(pathname)) {
		newUserButton = (
				<button
						className="icon-button"
						title="New User"
						onClick={onNewUserClicked}
				>
						<FontAwesomeIcon icon={faUserPlus} />
				</button>
		)
	}

	let userButton = null
	if (isManager || isAdmin) {
			if (!USERS_REGEX.test(pathname) && pathname.includes('/dashboard')) {
					userButton = (
							<button
									className="icon-button"
									title="Users"
									onClick={onUsersClicked}
							>
									<FontAwesomeIcon icon={faUserGear} />
							</button>
					)
			}
	}

	let notesButton = null;
	if (!NOTES_REGEX.test(pathname) && pathname.includes('/dashboard')) {
		notesButton = (
				<button
						className="icon-button"
						title="Notes"
						onClick={onNotesClicked}
				>
						<FontAwesomeIcon icon={faFilePen} />
				</button>
		)
	}

	const logoutButton = (
		<button
				className="icon-button"
				title="Logout"
				onClick={handleLogout}
		>
				<FontAwesomeIcon icon={faRightFromBracket} />
		</button>
	);

	const errClass = isError ? "errmsg" : "offscreen"

	let buttonContent
    if (isLoading) {
        buttonContent = <p>Logging Out...</p>
    } else {
			buttonContent = (
					<>
							{newNoteButton}
							{newUserButton}
							{notesButton}
							{userButton}
							{logoutButton}
					</>
			)
    }

	const content = (
		<>
			<p className={errClass}>{(error as any)?.data?.message}</p>
			<header className="dash-header">
					<div className={`dash-header__container ${dashClass}`}>
							<Link to="/dashboard">
									<h1 className="dash-header__title">techNotes</h1>
							</Link>
							<nav className="dash-header__nav">
								{buttonContent}
							</nav>
					</div>
			</header>
		</>
)

return content
};
