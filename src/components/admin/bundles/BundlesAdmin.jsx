import React, { useEffect, useState } from "react";
import AdminHOC from "../../shared/HOC/AdminHOC";
import Paginate from "../../shared/pagination/Paginate";
import Toast from "../../shared/toast/Toast";
import ConfirmDeletePopup from "../../shared/confirmDeletePopup/ConfirmDeletePopup";
import { Table, Empty, Button, Typography, Divider, Space, Tooltip } from "antd";
import {
  DeleteOutlined,
  ExportOutlined,
  UsergroupAddOutlined, EyeOutlined,
  GroupOutlined,
  PlusOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getAllBundles,
  deleteBundle,
} from "../../../service/BundleService";
import AddBundle from "./AddBundle";
import "./BundlesAdmin.css"; // 👈 Import CSS for styles

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
  }, []);

  const handleAddNew = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleDeleteBundle = async () => {
    try {
      setLoading(true);
      await deleteBundle(bundleToDelete?.id);
      setToastMessage("Bundle deleted successfully!");
      setToastType("success");
      setShowToast(true);
      await getBundles();
    } catch (error) {
      setToastMessage("Error occurred while deleting the Bundle.");
      setToastType("error");
      setShowToast(true);
    } finally {
      setIsConfirmPopupOpen(false);
      setBundleToDelete(null);
      setLoading(false);
    }
  };

  const handleViewBundleClick = (id, name) => {
    navigate(`/bundles-history/${id}`, {
      state: { name: name },
    });
  };

  const handleOpenConfirmDeletePopup = (bundle) => {
    setIsConfirmPopupOpen(true);
    setBundleToDelete(bundle);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      dataIndex: "srNo",
      title: "Sr. No.",
      key: "srNo",
      width: 70,
    },
    {
      dataIndex: "bundleName",
      title: "Bundle Name",
      key: "bundleName",
      width: 150,
    },
    {
      title: "Actions",
      key: "actions",
      width: 180,
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
            <Button
              icon={<EyeOutlined />}
              onClick={() => {
                navigate(`/bundle-report/${record?.id}`);
              }}
            />
          </Space>
        </>
      )
    }

  ]


  return (
    <div className="bundle-container">
      <div className="bundle-header">
        <Title level={2} className="bundle-title"><GroupOutlined style={{ marginRight: 12 }} />Active Bundles Overview</Title>
      </div>
      <div className="add-btn-div">
        <Tooltip title="Create new bundle" >
          <Button
            icon={<PlusOutlined />}
            onClick={handleAddNew}
            className="add-btn"
          >
            Create new Bundle
          </Button>
        </Tooltip>
        <Button
          icon={<ExportOutlined />}
          onClick={() => navigate("/bundle-report")}
          className="add-btn"
        >
          Report
        </Button>

      </div>


      <Divider />

      <div className="bundle-table">
        {processedBundles?.length > 0 ? (
          <Table
            dataSource={processedBundles}
            columns={columns}
            bordered
            scroll={{ x: true }}
            locale={{ emptyText: "No bundles found." }}
            rowKey="id"
            pagination={{ position: ['bottomCenter'] }}
          />
        ) : (
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
      </div>

      {/* Popups & Modals */}
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
  );
};

export default AdminHOC(BundlesAdmin);
