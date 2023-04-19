declare type Nullable<T> = T | null;
declare type NonNullable<T> = T extends null | undefined ? never : T;
declare type Recordable<T = any> = Record<string, T>;
declare type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T;
};
declare module '@zkzc/fe-utils'
// 表格分页的查询条件
interface filterPage{
  pageSize: number, // 每页条数
  pageNum: number, // 当前页
  rowTotal: number|null, // 总条数
  sortName?: string,
  sortOrder?: string,
  pageSizes: number[]
}
// 表格分页的tableData接口
interface tablePageData{
  tableData: Recordable[],
  tableKeys: Recordable[],
  selection?:boolean,
  tableFunctions?:Recordable[],
  funcWidth?:number|string,
  columnFunctionsWidth?:number|string

}
