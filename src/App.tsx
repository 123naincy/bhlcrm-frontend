import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/auth/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardPage from "./pages/dashboard/DashboardPage";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import TeamPage from "./pages/team/TeamPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import LeadKanbanPage from "./pages/leads/LeadKanbanPage";
import MyLeadsPage from "./pages/leads/MyLeadsPage";
import AssignedLeadsPage from "./pages/leads/AssignedLeadsPage";
import AllLeadsPage from "./pages/leads/AllLeadsPage";
import ProjectsPage from "./pages/projects/ProjectsPage";
import SourceMappingPage from "./pages/source/SourceMappingPage";
import LeadDetailPage from "./pages/leads/LeadDetailPage";
import InventoryDashboard from "./pages/inventory/InventoryDashboard";
import InventoryUnitDetails from "./pages/inventory/InventoryUnitDetails";
import BookingList from "./pages/booking/BookingList";
import BookingDetails from "./pages/booking/BookingDetails";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<LoginPage />} />

        {/* PROTECTED */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route
            path="dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="leads/all"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "super_admin",
                  "admin",
                  "sales_manager",
                ]}
              >
                <AllLeadsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="projects"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "super_admin",
                  "admin",
                ]}
              >
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="source-mappings"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "super_admin",
                  "admin",
                ]}
              >
                <SourceMappingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="leads/assigned"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "super_admin",
                  "admin",
                  "sales_manager",
                ]}
              >
                <AssignedLeadsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="leads/my"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "sales_executive",
                  "telecaller",
                ]}
              >
                <MyLeadsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="leads/kanban"
            element={<LeadKanbanPage />}
          />

          <Route
            path="/leads/:id"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "super_admin",
                  "admin",
                  "sales_manager",
                  "sales_executive",
                  "telecaller",
                ]}
              >
                <LeadDetailPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="analytics"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "super_admin",
                  "admin",
                  "sales_manager",
                  "support_agent",
                ]}
              >
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="team"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "super_admin",
                  "admin",
                ]}
              >
                <TeamPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="inventory"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "super_admin",
                  "admin",
                ]}
              >
                <InventoryDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="inventory/unit/:id"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "super_admin",
                  "admin",
                ]}
              >
                <InventoryUnitDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="bookings"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "super_admin",
                  "admin",
                ]}
              >
                <BookingList />
              </ProtectedRoute>
            }
          />

          <Route
            path="bookings/:id"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "super_admin",
                  "admin",
                ]}
              >
                <BookingDetails />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;