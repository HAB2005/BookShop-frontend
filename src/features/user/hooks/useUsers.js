import { useEffect, useState, useCallback } from "react";
import { fetchUsersService } from "../services/userService";

export function useUsers(filters = {}) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 100, // Đổi lại về 100
    totalPages: 0,
    totalElements: 0,
    first: true,
    last: true,
    empty: true
  });

  const [currentFilters, setCurrentFilters] = useState({
    page: 0,
    size: 100, // Đổi lại về 100
    sortBy: "createdAt",
    sortDir: "desc",
    username: "",
    email: "",
    role: "",
    status: "",
    ...filters
  });

  useEffect(() => {
    loadUsers();
  }, [
    currentFilters.page,
    currentFilters.size,
    currentFilters.sortBy,
    currentFilters.sortDir,
    currentFilters.username,
    currentFilters.email,
    currentFilters.role,
    currentFilters.status
  ]);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetchUsersService(currentFilters);
      setUsers(res.users || []);
      setPagination({
        page: res.page,
        size: res.size,
        totalPages: res.totalPages,
        totalElements: res.totalElements,
        first: res.first,
        last: res.last,
        empty: res.empty
      });
    } catch (err) {
      setError(err.message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [currentFilters]);

  const updateFilters = useCallback((newFilters) => {
    setCurrentFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 0 // Reset to first page when filters change
    }));
  }, []);

  const changePage = useCallback((newPage) => {
    setCurrentFilters(prev => ({
      ...prev,
      page: newPage
    }));
  }, []);

  const changePageSize = useCallback((newSize) => {
    setCurrentFilters(prev => ({
      ...prev,
      size: newSize,
      page: 0 // Reset to first page when page size changes
    }));
  }, []);

  const changeSorting = useCallback((sortBy, sortDir = "asc") => {
    setCurrentFilters(prev => ({
      ...prev,
      sortBy,
      sortDir,
      page: 0 // Reset to first page when sorting changes
    }));
  }, []);

  const updateUserInList = useCallback((userId, updates) => {
    setUsers(prev => prev.map(user => 
      user.userId === userId ? { ...user, ...updates } : user
    ));
  }, []);

  const refreshAllUsers = useCallback(() => {
    setCurrentFilters({
      page: 0,
      size: 1000,
      sortBy: "createdAt",
      sortDir: "desc",
      username: "",
      email: "",
      role: "",
      status: ""
    });
  }, []);

  return {
    users,
    loading,
    error,
    pagination,
    filters: currentFilters,
    loadUsers,
    updateFilters,
    changePage,
    changePageSize,
    changeSorting,
    updateUserInList,
    refreshAllUsers
  };
}
