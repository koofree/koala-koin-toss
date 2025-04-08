import EthereumIcon from '../image/EthereumIcon';

interface TextFormProps {
  value: number;
}

export const TextForm = ({ value }: TextFormProps) => {
  return (
    <div
      className="flex items-center bg-[#24223D] 
        w-[240px] pr-3 pl-2 
        rounded-tl-2xl rounded-br-2xl rounded-bl-lg rounded-tr-lg
        "
    >
      <div className="w-[16px] inline-block mx-2">
        <EthereumIcon />
      </div>
      <input
        type="text"
        disabled
        value={value}
        className="w-[120px] h-[60px] appearance-none bg-transparent cursor-pointer
                    bg-contain text-white"
      />
    </div>
  );
};
