import { Button } from '@/core/components/ui/button'
import { cn } from '@/core/lib/utils'

export function CategoryNav({ categories = [], selectedSlug, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={!selectedSlug ? 'default' : 'outline'}
        size="sm"
        onClick={() => onSelect('')}
      >
        Todos
      </Button>
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={selectedSlug === cat.slug ? 'default' : 'outline'}
          size="sm"
          onClick={() => onSelect(cat.slug)}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  )
}
