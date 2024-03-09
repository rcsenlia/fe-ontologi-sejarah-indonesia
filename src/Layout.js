import { Outlet, Link } from "react-router-dom";

const Layout = () => {
    return(
        <>
        <ul class="flex bg-red-800">
            <li class="mr-6">
                <a class="text-blue-500 hover:text-blue-800" href="#">Active</a>
            </li>
            <li class="mr-6">
                <a class="text-blue-500 hover:text-blue-800" href="#">Link</a>
            </li>
            <li class="mr-6">
                <a class="text-blue-500 hover:text-blue-800" href="#">Link</a>
            </li>
            <li class="mr-6">
                
            </li>
        </ul>
        <Outlet />
        </>
    )
  };
  
  export default Layout;