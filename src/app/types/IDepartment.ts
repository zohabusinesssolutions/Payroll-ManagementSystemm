export interface IPermission {
  id: string;
  departmentId: string;
  model: string;
  accessScope: 'SELF' | 'ALL';
  accessLevel: 'READ' | 'WRITE';
  createdAt: string;
  updatedAt: string;
}

export interface IDepartment {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  permissions: IPermission[];
}