import { Link, useLocation } from 'react-router-dom';
import "./sidebar.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUserTie, faUserFriends, faBox, faFileInvoice, faReceipt, faTags, faComments, faList } from '@fortawesome/free-solid-svg-icons';
import decodeToken from '../../utils/DecodeToken';

const Sidebar = () => {
    const location = useLocation();

    const token = localStorage.getItem('token');
    const decodedToken = decodeToken(token)
    const userRole = decodedToken?.role;


    // Mảng chứa các mục trong sidebar
    const sidebarItems = [
        { path: "/", label: "Trang chủ", icon: faHome },
        { path: "/user", label: "Nhân viên", icon: faUserTie },
        { path: "/customer", label: "Khách hàng", icon: faUserFriends },
        { path: "/type-product", label: "Nhóm sản phẩm", icon: faList },
        { path: "/product", label: "Sản phẩm", icon: faBox },
        { path: "/order", label: "Hóa đơn", icon: faFileInvoice },
        { path: "/receipt", label: "Phiếu Nhập", icon: faReceipt },
        { path: "/promotion", label: "Chương trình khuyến mãi", icon: faTags },
        { path: "/blog", label: "Diễn đàn", icon: faComments },
    ];

    // Nếu vai trò của người dùng là "member", ẩn đi mục "Người dùng" và "Phiếu Nhập"
    const filteredSidebarItems = sidebarItems.filter(item => {
        if (userRole === "member" && (item.path === "/user" || item.path === "/receipt")) {
            return false; // Ẩn đi mục này
        }
        return true; // Hiển thị mục này
    });

    return (
        <div className="sidebar">
            <ul>
                {filteredSidebarItems.map((item, index) => (
                    <li key={index} className={location.pathname === item.path ? "active" : ""}>
                        <Link to={item.path}>
                            <FontAwesomeIcon size="lg" icon={item.icon} /> {item.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Sidebar;
