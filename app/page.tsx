"use client"
import { Button } from 'primereact/Button';
import { useState } from 'react';
import AddTask from './components/AddTask';
import TodoList from './components/TodoList';

export default function Home() {
  return (
    <main className='max-w-4xl mx-auto mt-4'>
    <TodoList />
    </main>
  )
}
