import { Button } from '@material-ui/core';
import './Header.css'
import logo from '../logo.png';

function Header({openSignup, onSignin, isLogin, onSignOut}) {
    return (
        <div className={'Header'}>
        <img src={logo} alt={'instagram logo'} className={'Header__image'} />
        {isLogin? (<Button onClick={onSignOut}>
          Sign Out
        </Button>):(
        <div>
          <Button onClick={onSignin}>Login</Button>
          <Button onClick={openSignup}>Sign Up</Button>
        </div>
        )}
      </div>
    )
}

export default Header
