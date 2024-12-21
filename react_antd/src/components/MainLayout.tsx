import React, {useState} from "react";
import {Layout, Menu, MenuProps} from "antd";
import Header from "@/components/Header";
import {Route, Routes, useLocation, useNavigate} from "react-router-dom";
import Home from "@/pages/Home.tsx";
import AdminList from "@/pages/admin/AdminList.tsx";
import UniversityList from "@/pages/university/UniversityList.tsx";
import FacultyList from "@/pages/faculty/FacultyList.tsx";
import MajorList from "@/pages/major/MajorList.tsx";
import TeacherList from "@/pages/teacher/TeacherList.tsx";
import StudentList from "@/pages/student/StudentList.tsx";
import CourseList from "@/pages/course/CourseList.tsx";
import AttendanceList from "@/pages/attendance/AttendanceList.tsx";
import GradeList from "@/pages/grade/GradeList.tsx";
import ChartList from "@/pages/chart/ChartList.tsx";
import TeacherPersonalInfo from "@/pages/teacher/TeacherPersonalInfo.tsx";
import StudentPersonalInfo from "@/pages/student/StudentPersonalInfo.tsx";
import {
  AuditOutlined,
  BankOutlined,
  BellOutlined,
  BookOutlined,
  CustomerServiceOutlined,
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  SolutionOutlined,
  TableOutlined,
  TeamOutlined,
  UserOutlined
} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {getTypeAsNumber} from "@/utils/getTypeAsNumberFromSessionStorage.ts"

const MainLayout: React.FC = () => {

  const {Sider, Content} = Layout;
  const { t } = useTranslation();

  const contentStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    padding: '10px 10px',
    overflowY: 'auto'
  };

  const siderStyle: React.CSSProperties = {
    textAlign: 'center',
    lineHeight: '120px'
  };

  const layoutStyle = {
    overflow: 'hidden',
    height: '100vh',
    width: '100vw',
  };

  const [collapsed, setCollapsed] = useState(false);

  let menuItems = [
    { key: 'collapse', label: '收起', icon: collapsed ? React.createElement(MenuUnfoldOutlined) : React.createElement(MenuFoldOutlined) },
    { key: '/Home', label: '主页', path: '/Home', icon: React.createElement(HomeOutlined) },
    { key: '/AdminList', label: '管理员', path: '/AdminList', icon: React.createElement(UserOutlined) },
    { key: '/UniversityList', label: '学校信息', path: '/UniversityList', icon: React.createElement(BankOutlined) },
    { key: '/FacultyList', label: '院系信息', path: '/FacultyList', icon: React.createElement(TableOutlined) },
    { key: '/MajorList', label: '专业信息', path: '/MajorList', icon: React.createElement(BookOutlined) },
    { key: '/TeacherList', label: '教师信息', path: '/TeacherList', icon: React.createElement(SolutionOutlined) },
    { key: '/StudentList', label: '学生信息', path: '/StudentList', icon: React.createElement(TeamOutlined) },
    { key: '/CourseList', label: '课程信息', path: '/CourseList', icon: React.createElement(CustomerServiceOutlined) },
    { key: '/AttendanceList', label: '考勤信息', path: '/AttendanceList', icon: React.createElement(BellOutlined) },
    { key: '/GradeList', label: '成绩信息', path: '/GradeList', icon: React.createElement(AuditOutlined) },
    { key: '/ChartList', label: '数据统计', path: '/ChartList', icon: React.createElement(PieChartOutlined) },
  ];
  const type = getTypeAsNumber()
  if (type === 2) {
    menuItems = [
      { key: 'collapse', label: '收起', icon: collapsed ? React.createElement(MenuUnfoldOutlined) : React.createElement(MenuFoldOutlined) },
      { key: '/Home', label: '主页', path: '/Home', icon: React.createElement(HomeOutlined) },
      { key: '/TeacherPersonalInfo', label: '教师个人信息', path: '/TeacherPersonalInfo', icon: React.createElement(SolutionOutlined) },
      { key: '/CourseListOfTeacher', label: '我的课程', path: '/CourseListOfTeacher', icon: React.createElement(CustomerServiceOutlined) },
      { key: '/GradeListOfTeacher', label: '学生成绩', path: '/GradeListOfTeacher', icon: React.createElement(AuditOutlined) },
    ]
  }
  if (type === 3) {
    menuItems = [
      { key: 'collapse', label: '收起', icon: collapsed ? React.createElement(MenuUnfoldOutlined) : React.createElement(MenuFoldOutlined) },
      { key: '/Home', label: '主页', path: '/Home', icon: React.createElement(HomeOutlined) },
      { key: '/StudentPersonalInfo', label: '学生个人信息', path: '/StudentPersonalInfo', icon: React.createElement(TeamOutlined) },
      { key: '/CourseListOfStudent', label: '我的课程', path: '/CourseListOfStudent', icon: React.createElement(CustomerServiceOutlined) },
      { key: '/AttendanceListOfStudent', label: '我的考勤', path: '/AttendanceListOfStudent', icon: React.createElement(BellOutlined) },
      { key: '/GradeListOfStudent', label: '我的成绩', path: '/GradeListOfStudent', icon: React.createElement(AuditOutlined) },
    ]
  }

  const navigate = useNavigate();

  const location = useLocation();
  const defaultLocation = location.pathname === '/' ? '/Home' : location.pathname;

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    if (e.key === 'collapse') {
      setCollapsed(!collapsed)
      return
    }
    navigate(e.key);
  };

  return (
    <Layout style={layoutStyle}>
      <Header title={t('title')}/>
      <Layout>
        <Sider collapsible collapsed={collapsed} style={siderStyle} theme={"light"} trigger={null}>
          <Menu
            onClick={handleMenuClick}
            defaultSelectedKeys={[defaultLocation]}
            defaultOpenKeys={[defaultLocation]}
            mode="inline"
            items={menuItems}
          />
        </Sider>
        <Content style={contentStyle}>
          <Routes>
            <Route path="/Home" element={<Home/>} />
            <Route path="/AdminList" element={<AdminList/>} />
            <Route path="/UniversityList" element={<UniversityList/>} />
            <Route path="/FacultyList" element={<FacultyList/>} />
            <Route path="/MajorList" element={<MajorList/>} />
            <Route path="/TeacherList" element={<TeacherList/>} />
            <Route path="/StudentList" element={<StudentList/>} />
            <Route path="/CourseList" element={<CourseList/>} />
            <Route path="/AttendanceList" element={<AttendanceList/>} />
            <Route path="/GradeList" element={<GradeList/>} />
            <Route path="/ChartList" element={<ChartList/>} />
            <Route path="/TeacherPersonalInfo" element={<TeacherPersonalInfo/>} />
            <Route path="/CourseListOfTeacher" element={<CourseList/>} />
            <Route path="/GradeListOfTeacher" element={<GradeList/>} />
            <Route path="/StudentPersonalInfo" element={<StudentPersonalInfo/>} />
            <Route path="/CourseListOfStudent" element={<CourseList/>} />
            <Route path="/AttendanceListOfStudent" element={<AttendanceList/>} />
            <Route path="/GradeListOfStudent" element={<GradeList/>} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout;