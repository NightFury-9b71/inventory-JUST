export const PageLayout = ({ header, body, footer }: { header: React.ReactNode, body: React.ReactNode, footer?: React.ReactNode }) => {
  return (
    <>
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 border-b">{header}</div>
      <div className="p-3 sm:p-4 md:p-5 lg:p-6">{body}</div>
      {footer && <div className="p-3 sm:p-4 md:p-5 lg:p-6 border-t">{footer}</div>}
    </>
  );
}


export const Header = ({title, subtitle, searchbar, filters, actions}: { title: string, subtitle?: string, searchbar?: React.ReactNode, filters?: React.ReactNode, actions?: React.ReactNode }) => {
  return (
    <div className="flex flex-col space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm sm:text-base text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex justify-start sm:justify-end">{actions}</div>}
      </div>
      {(searchbar || filters) && (
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          {searchbar && <div className="flex-1">{searchbar}</div>}
          {filters && <div className="flex flex-wrap gap-2">{filters}</div>}
        </div>
      )}
    </div>
  );
}