export type Mode = 'edit' | 'insert';

export interface SelectionInfo {
    type: 'none' | 'element';
    label?: string;
    id?: string;
};

export interface ViewModel {
    svg: string;
    svgId: number;
    selection: SelectionInfo;
};

export interface TreeNodeData {
    id: string;
    element: string;
    children?: TreeNodeData[];
    isLeaf?: boolean;
    text?: string;
    attributes?: Record<string, unknown>;
};

export interface Tab {
    label: string;
    value: number;
    component: any; // Replace with specific Svelte component type if available
}

export interface EditInfo {
    chainedId: string;
    canUndo: boolean;
    canRedo: boolean;
    isMensuralMusicOnly: boolean;
}

export interface ReferenceObject extends TreeNodeData {
    referenceAttribute: string;
}

export interface EditInfoContent {
    ancestors: TreeNodeData[];
    context: TreeNodeData;
    object: TreeNodeData;
    referencedElements: ReferenceObject[];
    referringElements: ReferenceObject[];
}

export type AttributeEdit = {
    elementId: string;
    attName: string;
    attValue: string;
    commit: boolean;
};

export type EditActionParamSet = {
    elementId: string;
    attribute: string;
    value: string;
}

export type EditorAction = {
    action: "commit" | "context" | "set";
    param?: EditActionParamSet | {};
};
