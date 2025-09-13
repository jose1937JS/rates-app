type Currency = {
	id: number;
	name: string;
	price: string;
}

type Rate = {
	rate: number;
	name: string;
	currency: string;
	createdAt: string;
}
interface HomeProps {
	rates: Rate[];
	onRefreshData: Function
}

export type { Currency, Rate, HomeProps };