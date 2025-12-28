import React, { useState } from 'react';
import { Card, Button, Input, cn } from './UI';
import { ShoppingCart, Plus, Trash2, CheckCircle, Award, Pencil, Save, X, Download, Share2, AlertCircle } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface ShoppingItem {
  id: string;
  name: string;
  price: number;
}

interface ShoppingListProps {
  onConcludePurchase: (total: number, itemsCount: number) => void;
}

export const ShoppingList: React.FC<ShoppingListProps> = ({ onConcludePurchase }) => {
  // Estados Locais
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  
  // Estado de Edição
  const [editingId, setEditingId] = useState<string | null>(null);

  // Estado do Popup Local
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [lastTotal, setLastTotal] = useState(0);

  // Adicionar ou Atualizar Item
  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return; // Apenas nome é obrigatório agora

    const numericPrice = price ? parseFloat(price) : 0;

    if (editingId) {
        // Atualizar existente
        setItems(prev => prev.map(item => 
            item.id === editingId 
                ? { ...item, name, price: numericPrice }
                : item
        ));
        setEditingId(null);
    } else {
        // Criar novo
        const newItem: ShoppingItem = {
            id: Date.now().toString(),
            name: name,
            price: numericPrice
        };
        setItems([...items, newItem]);
    }

    setName('');
    setPrice('');
    document.getElementById('prod-name')?.focus();
  };

  // Iniciar Edição
  const handleEdit = (item: ShoppingItem) => {
      setName(item.name);
      // Se o preço for 0 (não definido), deixa o campo vazio para facilitar digitação
      setPrice(item.price === 0 ? '' : item.price.toString());
      setEditingId(item.id);
      
      // Se já tem nome, foca no preço direto para agilizar no mercado
      if (item.name) {
        setTimeout(() => document.getElementById('prod-price')?.focus(), 50);
      } else {
        document.getElementById('prod-name')?.focus();
      }
  };

  // Cancelar Edição
  const handleCancelEdit = () => {
      setName('');
      setPrice('');
      setEditingId(null);
  };

  // Remover Item
  const handleRemove = (id: string) => {
    setItems(items.filter(i => i.id !== id));
    if (editingId === id) {
        handleCancelEdit();
    }
  };

  // Calcular Total
  const total = items.reduce((acc, item) => acc + item.price, 0);
  const pendingItemsCount = items.filter(i => i.price === 0).length;

  // --- Export Functions ---

  const handleShareWhatsApp = () => {
    if (items.length === 0) return;

    const date = new Date().toLocaleDateString('pt-BR');
    let message = `🛒 *Lista de Compras Cashfy - ${date}*\n\n`;
    
    items.forEach(item => {
        const priceTxt = item.price > 0 ? `R$ ${item.price.toFixed(2)}` : '___';
        message += `▫️ ${item.name}: ${priceTxt}\n`;
    });
    
    message += `\n💰 *TOTAL ATUAL: R$ ${total.toFixed(2)}*`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const handleDownloadPDF = () => {
    if (items.length === 0) return;

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('pt-BR');
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // Emerald color
    doc.text('Cashfy - Lista de Compras', 20, 20);
    
    doc.setFontSize(12);
    doc.setTextColor(100, 116, 139); // Slate color
    doc.text(`Data: ${date}`, 20, 30);
    
    // Line
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);

    // Items
    let y = 50;
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);

    items.forEach((item, index) => {
        const itemText = `${item.name}`;
        const priceText = item.price > 0 ? `R$ ${item.price.toFixed(2)}` : '_______';
        
        doc.text(itemText, 20, y);
        doc.text(priceText, 160, y, { align: 'right' });
        
        y += 10;
        
        // Add new page if list is too long
        if (y > 280) {
            doc.addPage();
            y = 20;
        }
    });

    // Total
    doc.line(20, y, 190, y);
    y += 15;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 20, y);
    doc.text(`R$ ${total.toFixed(2)}`, 160, y, { align: 'right' });

    doc.save(`lista-compras-cashfy-${date.replace(/\//g, '-')}.pdf`);
  };

  // --- Finalize Logic ---

  // Finalizar Compra
  const handleFinalize = () => {
    if (items.length === 0) return;

    // 1. Salva no App (cria transação)
    onConcludePurchase(total, items.length);
    
    // 2. Guarda o total para mostrar no popup
    setLastTotal(total);
    
    // 3. Abre o Popup
    setIsPopupOpen(true);
  };

  // Fechar Popup e Resetar
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setItems([]); // Limpa a lista para a próxima compra
    handleCancelEdit();
  };

  return (
    <div className="max-w-3xl mx-auto relative min-h-[500px]">
      
      {/* --- POPUP SIMPLES E DIRETO (LOCAL) --- */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-emerald-500 rounded-2xl shadow-2xl max-w-sm w-full p-8 text-center animate-fade-in relative overflow-hidden">
            {/* Background Glow Effect */}
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-teal-500" />
            
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              Compra Concluída!
            </h2>
            
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              O valor de <span className="font-bold text-emerald-600 dark:text-emerald-400">R$ {lastTotal.toFixed(2)}</span> foi registrado.
            </p>

            {/* --- XP Reward Section --- */}
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3 animate-pulse">
                <div className="p-2 bg-amber-100 dark:bg-amber-800/30 rounded-full shrink-0">
                    <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="text-left">
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-500 uppercase tracking-wider">Recompensa</p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                        <span className="text-amber-600 dark:text-amber-400 font-extrabold">+50 XP</span> para a conquista <span className="italic">"Comprador"</span>
                    </p>
                </div>
            </div>

            <Button onClick={handleClosePopup} className="w-full py-3 text-lg">
              OK, Entendido
            </Button>
          </div>
        </div>
      )}

      {/* --- Cabeçalho e Ações --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/20 rounded-xl text-emerald-600 dark:text-emerald-400">
                <ShoppingCart size={24} />
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Lista de Compras</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm">Planeje em casa, preencha no mercado.</p>
            </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex gap-2">
            <Button 
                variant="secondary" 
                onClick={handleShareWhatsApp}
                disabled={items.length === 0}
                className="flex items-center gap-2 text-sm bg-green-100 hover:bg-green-200 text-green-800 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50"
                title="Enviar por WhatsApp"
            >
                <Share2 size={16} /> WhatsApp
            </Button>
            <Button 
                variant="secondary"
                onClick={handleDownloadPDF}
                disabled={items.length === 0}
                className="flex items-center gap-2 text-sm"
                title="Baixar PDF"
            >
                <Download size={16} /> PDF
            </Button>
        </div>
      </div>

      {/* --- Área de Input --- */}
      <Card className={cn("p-6 mb-6 transition-colors border-2", editingId ? "border-blue-400 dark:border-blue-500/50 bg-blue-50/50 dark:bg-blue-900/10" : "border-emerald-100 dark:border-emerald-900/30")}>
        <div className="flex justify-between items-center mb-4">
             <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
                 {editingId ? 'Editando Item' : 'Novo Item'}
             </span>
             {editingId && (
                 <button onClick={handleCancelEdit} className="text-xs flex items-center gap-1 text-slate-500 hover:text-slate-800 dark:hover:text-white">
                     <X size={14} /> Cancelar
                 </button>
             )}
        </div>
        <form onSubmit={handleAddItem} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <Input 
              id="prod-name"
              label="Nome do Produto" 
              placeholder="Ex: Arroz 5kg" 
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className="w-full md:w-40">
            <Input 
              id="prod-price"
              label="Preço (Opcional)" 
              type="number" 
              step="0.01" 
              placeholder="0.00" 
              value={price}
              onChange={e => setPrice(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className={cn("h-[42px] px-6", editingId ? "bg-blue-600 hover:bg-blue-700 shadow-blue-900/20" : "")}>
                {editingId ? <Save size={20} /> : <Plus size={20} />}
            </Button>
          </div>
        </form>
      </Card>

      {/* --- Lista de Itens --- */}
      <div className="space-y-4">
        {items.length > 0 ? (
          items.map((item) => {
            const hasPrice = item.price > 0;
            return (
                <div key={item.id} className={cn(
                    "flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-xl border shadow-sm hover:shadow-md transition-all",
                    editingId === item.id ? "border-blue-400 ring-1 ring-blue-400 dark:border-blue-500" : "border-slate-100 dark:border-slate-700",
                    !hasPrice && "border-l-4 border-l-amber-400 dark:border-l-amber-500"
                )}>
                <span className="font-medium text-slate-800 dark:text-slate-200">{item.name}</span>
                <div className="flex items-center gap-4">
                    
                    {hasPrice ? (
                         <span className="font-mono text-slate-600 dark:text-slate-300">R$ {item.price.toFixed(2)}</span>
                    ) : (
                         <span className="text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md flex items-center gap-1">
                             <AlertCircle size={12} /> Definir valor
                         </span>
                    )}
                    
                    <div className="flex items-center gap-1">
                        <button 
                        onClick={() => handleEdit(item)}
                        className={cn("p-2 rounded-lg transition-colors", 
                            !hasPrice 
                            ? "text-amber-500 hover:bg-amber-100 dark:hover:bg-amber-900/30 animate-pulse" 
                            : "text-slate-400 hover:text-blue-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                        )}
                        title={hasPrice ? "Editar" : "Definir Preço"}
                        >
                        <Pencil size={18} />
                        </button>
                        <button 
                        onClick={() => handleRemove(item.id)}
                        className="p-2 text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Remover"
                        >
                        <Trash2 size={18} />
                        </button>
                    </div>
                </div>
                </div>
            );
          })
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
            <ShoppingCart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">Sua lista está vazia.</p>
          </div>
        )}
      </div>

      {/* --- Rodapé Fixo / Total --- */}
      <div className="sticky bottom-4 mt-8">
        <Card className="p-4 bg-slate-900 text-white shadow-xl flex items-center justify-between border-slate-700">
            <div>
                <p className="text-slate-400 text-xs uppercase font-bold tracking-wider">Total da Compra</p>
                <div className="flex items-end gap-2">
                    <p className="text-3xl font-bold text-emerald-400">R$ {total.toFixed(2)}</p>
                    {pendingItemsCount > 0 && (
                        <p className="text-xs text-amber-400 mb-1.5 flex items-center gap-1">
                             <AlertCircle size={12} /> {pendingItemsCount} pendentes
                        </p>
                    )}
                </div>
            </div>
            <Button 
                onClick={handleFinalize} 
                disabled={items.length === 0}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 h-auto text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Finalizar Compra
            </Button>
        </Card>
      </div>

    </div>
  );
};