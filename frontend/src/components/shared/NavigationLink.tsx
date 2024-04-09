import { Link } from "react-router-dom"


type LinkProp = {                   //helpful data for link in one object
    to: string;
    bg: string;
    text:  string;
    textColor: string;
    onClick?: ()=> Promise<void>
}                                       

const NavigationLink = ( prop :LinkProp) => {
  return (
    <Link className="nav-link" to={prop.to} style={{ background: prop.bg, color:prop.textColor }}>
       { prop.text }
    </Link>
  )
}

export default NavigationLink
