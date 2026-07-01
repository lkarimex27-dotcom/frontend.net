import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

const navItems = [
  { label: 'Productos', path: '/productos', icon: <Inventory2OutlinedIcon /> },
  { label: 'Categorías', path: '/categorias', icon: <CategoryOutlinedIcon /> },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box sx={{ height: '100%', bgcolor: 'background.paper' }}>
      <Toolbar>
        <Typography variant="h6" sx={{ color: 'primary.main', letterSpacing: 0.5 }}>
          LaTienda
        </Typography>
      </Toolbar>
      <Divider />
      <List sx={{ px: 1, pt: 1 }}>
        {navItems.map((item) => {
          const selected = location.pathname.startsWith(item.path);
          return (
            <ListItemButton
              key={item.path}
              selected={selected}
              onClick={() => {
                navigate(item.path);
                setMobileOpen(false);
              }}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': { color: 'primary.contrastText' },
                  '&:hover': { bgcolor: 'primary.dark' },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ width: { sm: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={() => setMobileOpen(!mobileOpen)}
            sx={{ display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Panel de administración
          </Typography>
          <Box>
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ width: 34, height: 34, bgcolor: 'secondary.main', color: 'secondary.contrastText', fontSize: 14 }}>
                {(usuario?.nombre || usuario?.email || '?').charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled>{usuario?.nombre || usuario?.email}</MenuItem>
              <Divider />
              <MenuItem onClick={handleLogout}>
                <LogoutIcon fontSize="small" sx={{ mr: 1 }} /> Cerrar sesión
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { width: drawerWidth, borderRight: '1px solid', borderColor: 'divider' } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` }, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
