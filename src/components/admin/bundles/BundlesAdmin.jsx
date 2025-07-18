import React, { useEffect, useState } from "react";
import AdminHOC from "../../shared/HOC/AdminHOC";
import Paginate from "../../shared/pagination/Paginate";
import searchLogo from "../../../assets/magnifying-glass.png";
import Toast from "../../shared/toast/Toast";
import ConfirmDeletePopup from "../../shared/confirmDeletePopup/ConfirmDeletePopup";
import { Table, Empty, Button, Tag, Space, Layout, Typography, Divider } from "antd";
import { EditOutlined, DeleteOutlined, ExportOutlined, UsergroupAddOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAllBundles, deleteBundle } from "../../../service/BundleService";
import AddBundle from "./AddBundle";

const { Content } = Layout;
const { Title } = Typography;
const BundlesAdmin = ({ setLoading }) => {


  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bundleList, setBundleList] = useState([]);
  const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState(null);
  const [bundleToDelete, setBundleToDelete] = useState(null);

  const processedBundles = bundleList?.map((bundle, index) => ({
    id: bundle.bundleId,
    srNo: index + 1,
    bundleName: bundle.bundleName,
    creatorName: bundle.creatorName || "N/A",
  }));


  async function getBundles() {
    const bundles = await getAllBundles();
    setBundleList(bundles);
  }

  useEffect(() => {
    getBundles();
  }, [])

  const handleAddNew = () => {
    setIsModalOpen(prev => !prev);
  };

  const handleDeleteBundle = async () => {
    try {
      setLoading(true)
      const data = [];

      await deleteBundle(bundleToDelete?.id);
      setToastMessage(data?.message || "Bundle deleted successfully!");
      setToastType("success");
      setShowToast(true);
      await getBundles();
    } catch (error) {
      setToastMessage(error?.message || "Error occurred while deleting the Bundle.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsConfirmPopupOpen(false);
      setBundleToDelete(null);
      setLoading(false)
    }
  };


  const handleViewBundleClick = (id, name) => {
    console.log("usersAdmin name ", id);
    navigate(`/bundles-history/${id}`, {
      state: { name: name }
    });
  };

  const handleOpenConfirmDeletePopup = (bundle) => {
    setIsConfirmPopupOpen(true);
    setBundleToDelete(bundle);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const fields = [
    {
      dataIndex: "srNo",
      title: "Sr. No.",
      key: "srNo",
      width: 70
    },
    {
      dataIndex: "bundleName",
      title: "Bundle Name",
      key: "bundleName",
      width: 100
    },
    {
      title: "Actions",
      key: "actions",
      width: 250,
      render: (text, record) => (
        <>
          <Space >
            <Button
              icon={<DeleteOutlined />}
              style={{ marginRight: 8 }}
              onClick={() => handleOpenConfirmDeletePopup(record)}
            />
            <Button
              icon={<ExportOutlined />}
              onClick={() =>
                handleViewBundleClick(record?.id, record?.bundleName)
              }
            />
          </Space>
        </>
      )
    }

  ]


  return (
    <div className="admin-section">
      <Content style={{ margin: '0 16px' }}>
        <div className="site-layout-background" style={{ padding: 24, minHeight: 360, backgroundColor: '#f5f7fa' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0 }}>Bundles Overview</Title>

            <Button style={{ marginLeft: 100 }}
              icon={<UsergroupAddOutlined />}
              onClick={handleAddNew}
            >
              Create new Bundle
            </Button>
          </div>
          <Divider style={{ marginTop: 0 }} />
          <div className="user-table">
            {processedBundles?.length > 0 ? (
              <Table
                dataSource={processedBundles}
                columns={fields}
                bordered
                scroll={{ x: "100%", y: "100%" }}
                locale={{ emptyText: "No users found." }}
                rowKey="id"
                pagination={{ position: 'bottomCenter' }}
              />
            ) : (
              <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
          </div>

        </div>
      </Content>
      <Toast
        message={toastMessage}
        type={toastType}
        show={showToast}
        onClose={() => setShowToast(false)}
      />
      <AddBundle
        isModalOpen={isModalOpen}
        getBundles={getBundles}
        handleCloseModal={handleCloseModal}
        setToastMessage={setToastMessage}
        setToastType={setToastType}
        setShowToast={setShowToast}
        setLoading={setLoading}

      />
      <ConfirmDeletePopup
        isOpen={isConfirmPopupOpen}
        onClose={() => setIsConfirmPopupOpen(false)}
        onConfirm={handleDeleteBundle}
      />
    </div>
  )
};

export default AdminHOC(BundlesAdmin);
