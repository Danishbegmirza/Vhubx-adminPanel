import React from 'react';

declare module '@coreui/react' {
  export interface CSidebarProps {
    position?: string;
    visible?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    children?: React.ReactNode;
  }
  
  export interface CSidebarBrandProps {
    children?: React.ReactNode;
  }
  
  export interface CSidebarNavProps {
    children?: React.ReactNode;
  }
  
  export interface CNavItemProps {
    href?: string;
    active?: boolean;
    children?: React.ReactNode;
  }
  
  export interface CNavGroupProps {
    toggler?: React.ReactNode;
    children?: React.ReactNode;
  }
  
  export interface CNavLinkProps {
    href?: string;
    active?: boolean;
    children?: React.ReactNode;
  }
  
  export interface CHeaderProps {
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface CHeaderBrandProps {
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface CHeaderTogglerProps {
    className?: string;
    onClick?: () => void;
    children?: React.ReactNode;
  }
  
  export interface CHeaderNavProps {
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface CContainerProps {
    fluid?: boolean;
    children?: React.ReactNode;
  }
  
  export interface CDropdownProps {
    variant?: string;
    children?: React.ReactNode;
  }
  
  export interface CDropdownToggleProps {
    className?: string;
    caret?: boolean;
    children?: React.ReactNode;
  }
  
  export interface CDropdownMenuProps {
    className?: string;
    children?: React.ReactNode;
  }
  
  export interface CDropdownItemProps {
    children?: React.ReactNode;
  }
  
  export interface CDropdownDividerProps {}
  
  export const CSidebar: React.FC<CSidebarProps>;
  export const CSidebarBrand: React.FC<CSidebarBrandProps>;
  export const CSidebarNav: React.FC<CSidebarNavProps>;
  export const CNavItem: React.FC<CNavItemProps>;
  export const CNavGroup: React.FC<CNavGroupProps>;
  export const CNavLink: React.FC<CNavLinkProps>;
  export const CHeader: React.FC<CHeaderProps>;
  export const CHeaderBrand: React.FC<CHeaderBrandProps>;
  export const CHeaderToggler: React.FC<CHeaderTogglerProps>;
  export const CHeaderNav: React.FC<CHeaderNavProps>;
  export const CContainer: React.FC<CContainerProps>;
  export const CDropdown: React.FC<CDropdownProps>;
  export const CDropdownToggle: React.FC<CDropdownToggleProps>;
  export const CDropdownMenu: React.FC<CDropdownMenuProps>;
  export const CDropdownItem: React.FC<CDropdownItemProps>;
  export const CDropdownDivider: React.FC<CDropdownDividerProps>;
} 